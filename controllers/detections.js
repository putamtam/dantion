import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
// import { Storage } from "@google-cloud/storage";
// const { Storage } = require('@google-cloud/storage');
import storagePackage from '@google-cloud/storage';
const { Storage } = storagePackage;
// const Storage = Storage;
import { bigqueryClient } from '../index.js';

export const detectionAll = async (req, res) => {
    const queryDetectExist = `SELECT * FROM \`dangerdetection.dantion_big_query.detections\``;
    let options = {
        query: queryDetectExist,
        location: 'asia-southeast2'
    };
    const [detections] = await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "Berhasil mendapatkan data detection",
        detections: detections
    });
}

export const detectionAdd = async (req, res) => {
	const { lat, lon, type, userId, city } = req.body;
	const file = req.files.recordUrl;
	const status = "invalid";
    const storage = new Storage({ keyFilename: "dangerdetection-key.json" });
	const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
	if (
		userId === undefined ||
		lat === undefined ||
		lon === undefined ||
		file === undefined ||
		file === null ||
		type === undefined ||
		city === undefined
	) {
		return res.status(400).json({
			status: "Gagal",
			message: "Masukkan data dengan benar",
		});
	}
	
    const queryUserExist = `SELECT COUNT(email) AS emailCount FROM \`dangerdetection.dantion_big_query.users\` WHERE id=@id`;
    let options = {
        query: queryUserExist,
        location: 'asia-southeast2',
        params: { id: userId }
    };
    const [userExist] = await bigqueryClient.query(options);
	if (userExist.emailCount === 0) {
		return res.status(400).json({
			status: "Gagal",
			message: "User tidak ditemukan",
		});
	}
    const ext = file.name.split(".").filter(Boolean).slice(1).join(".");
    const recordName = `R-${type}-${uuidv4()}.${ext}`;
    const blob = bucket.file(`records/${recordName}`);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async () => {
        const id = "D-" + uuidv4();
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const recordUrl = `https://storage.googleapis.com/${bucket.name}/records/${recordName}`;

        const queryNewDetection = `INSERT \`dangerdetection.dantion_big_query.detections\`
        (id, lat, lon, recordUrl, type, status, userId, createdAt, updatedAt, city)
        VALUES (@id, @lat, @lon, @recordUrl, @type, @status, @userId, @createdAt, @updatedAt, @city)`;

        options = {
            query: queryNewDetection,
            location: 'asia-southeast2',
            params: {
                id: id,
                lat: lat,
                lon: lon,
                recordUrl: recordUrl,
                type: type,
                status: status,
                userId: userId,
                city: city,
                createdAt: createdAt,
                updatedAt: updatedAt
            }
        };

        await bigqueryClient.query(options);
        return res.json({
            status: "Sukses",
            message: "Data berhasil ditambahkan",
        });
    });
    blobStream.end(file.data);
}

export const detectionDetail = async (req, res) => {
    const { id } = req.params

    const queryDetectExist = `SELECT * FROM \`dangerdetection.dantion_big_query.detections\` WHERE id=@id`;
    let options = {
        query: queryDetectExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [detectExist] = await bigqueryClient.query(options);
    if(detectExist.length !== 0) {
        return res.json({
            status: "Sukses",
            message: "Data berhasil ditemukan",
            detection: detectExist 
        });
    } else {
        return res.status(400).json({
            status: "Gagal",
            message: "Data tidak ditemukan"
        });
    }
}

export const detectionUpdate = async (req, res) => {
    const {
        id, status, idUserLogin
    } = req.body;

    if(id === undefined || status === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const queryDetectExist = `SELECT * FROM \`dangerdetection.dantion_big_query.detections\` WHERE id=@id`;
    let options = {
        query: queryDetectExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [detectExist] = await bigqueryClient.query(options);
    if(detectExist.length === 0) {
        return res.json({
            status: "Gagal",
            message: "Data tidak ditemukan" 
        });
    }
    
    const queryUserExist = `SELECT role FROM \`dangerdetection.dantion_big_query.users\` WHERE id=@id`;
    options = {
        query: queryUserExist,
        location: 'asia-southeast2',
        params: { id: idUserLogin }
    };
    const [userExist] = await bigqueryClient.query(options);

    const userRole = userExist[0].role;
    const validatorId = userExist[0].validatorId;
    if (userRole !== "polisi" || userRole !== "ambulan" || userRole !== "damkar") {
        return res.json({
            status: "Gagal",
            message: "Anda tidak berhak memvalidasi data",
        });
    }

    const updatedAt = new Date().toISOString();
    detectExist.status = status;
    detectExist.updatedAt = updatedAt;

    const queryUpdate = `UPDATE \`dangerdetection.dantion_big_query.detections\`
    SET status=@status, updatedAt=@updatedAt, validatorId=@validatorId WHERE id=@id`;
    options = {
        query: queryUpdate,
        location: "asia-southeast2",
        params: {
            id: id,
            status: status,
            validatorId: validatorId,
            updatedAt: new Date().toISOString(),
        },
    };
    await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "Data berhasil diupdate"
    });
}

export const detectionDelete = async (req, res) => {
    const { id } = req.params;
    if(id === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }
    
    const queryDetectExist = `SELECT * FROM \`dangerdetection.dantion_big_query.detections\` WHERE id=@id`;
    let options = {
        query: queryDetectExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [rDetectExist] = await bigqueryClient.query(options);
    if(rDetectExist.length === 0) {
        return res.status(400).json({
            status: "Gagal",
            message: " Data tidak ditemukan"
        });
    }

    const detectExist = rDetectExist[0];
    const recordName = detectExist.recordUrl.split('/').slice(3).join('/');
    fs.unlink(`./${recordName}`, (err) => {
        if(err) {
            res.status(201).json({
                status: "Gagal",
                message: "Tidak dapat menghapus file"
            });
        }
    });

    const queryDeleteDetection = `DELETE \`dangerdetection.dantion_big_query.detections\` WHERE id=@id`;
    options = {
        query: queryDeleteDetection,
        location: 'asia-southeast2',
        params: { id: id }
    };
    await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "Data berhasil dihapus"
    });
}
