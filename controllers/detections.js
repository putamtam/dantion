import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { detections, users } from '../models/dantion.js';
import { Storage } from "@google-cloud/storage";

export const detectionAll = (req, res) => {
    return res.json({
        status: "Sukses",
        message: "Berhasil mendapatkan data detection",
        detections: detections
    });
}

export const detectionAdd = (req, res) => {
	const { lat, lon, type, status, userId } = req.body;
	const file = req.files.recordUrl;
	const isValid = false;
    const storage = new Storage({ keyFilename: "gcp-storage.json" });
	const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
	if (
		userId === undefined ||
		lat === undefined ||
		lon === undefined ||
		file === undefined ||
		file === null ||
		type === undefined ||
		status === undefined
	) {
		return res.status(400).json({
			status: "Gagal",
			message: "Masukkan data dengan benar",
		});
	}
	const userExist = users.find((user) => user.id === userId);
	if (userExist === undefined) {
		return res.status(400).json({
			status: "Gagal",
			message: "User tidak ditemukan",
		});
	}
    const ext = file.name.split(".").filter(Boolean).slice(1).join(".");
    const recordName = `R-${type}-${uuidv4()}.${ext}`;
    const blob = bucket.file(recordName);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
        res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", () => {
        const id = "D-" + uuidv4();
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;
        const recordUrl = `https://storage.googleapis.com/${bucket.name}/${recordName}`;
        const newDetection = {
            id,
            lat,
            lon,
            recordUrl,
            type,
            isValid,
            userId,
            createdAt,
            updatedAt,
        };
        detections.push(newDetection);
        return res.json({
            status: "Sukses",
            message: "Data berhasil ditambahkan",
        });
    });
    blobStream.end(file.data);
}

export const detectionDetail = (req, res) => {
    const { id } = req.params

    const detectExist = detections.find((detect) => detect.id === id);
    if(detectExist !== undefined) {
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

export const detectionUpdate = (req, res) => {
    const {
        id, isValid, idUserLogin
    } = req.body;

    if(id === undefined || isValid === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const detectExist = detections.find((detect) => detect.id === id);
    if(detectExist === undefined) {
        return res.json({
            status: "Gagal",
            message: "Data tidak ditemukan" 
        });
    }
    const userRole = users.find((user) => user.id === idUserLogin);

    const updatedAt = new Date().toISOString();

    if (userRole !== "polisi" || userRole !== "ambulan" || userRole !== "damkar") {
        return res.json({
            status: "Gagal",
            message: "Anda tidak berhak memvalidasi data",
        });
    }

    detectExist.isValid = isValid;
    detectExist.updatedAt = updatedAt;

    return res.json({
        status: "Sukses",
        message: "Data berhasil diupdate"
    });
}

export const detectionDelete = (req, res) => {
    const { id } = req.params;
    if(id === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }
    const detectExist = detections.find((detect) => detect.id === id);
    if(detectExist === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: " Data tidak ditemukan"
        });
    }

    const recordName = detectExist.recordUrl.split('/').slice(3).join('/');
    fs.unlink(`./${recordName}`, (err) => {
        if(err) {
            res.status(201).json({
                status: "Gagal",
                message: "Tidak dapat menghapus file"
            });
        }
    });

    const index = detections.findIndex((detect) => detect.id === id);
    detections.splice(index, 1);
    return res.json({
        status: "Sukses",
        message: "Data berhasil dihapus"
    });
}
