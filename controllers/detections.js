import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { detections, users } from '../models/dantion.js';

export const detectionAll = (req, res) => {
    return res.json({
        status: "Sukses",
        detections: detections
    });
}

export const detectionAdd = (req, res) => {
    const {
        latitude, longitude, type, status, userId
    } = req.body;
    const file = req.files.record;
    const isValid = false;
    if(userId === undefined || latitude === undefined || longitude === undefined || file === undefined || file === null || type === undefined || status === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }
    const userExist = users.find((user) => user.id === userId);
    if (userExist === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "User tidak ditemukan",
        });
    }

    const ext = file.name.split('.').filter(Boolean).slice(1).join('.');
    const recordName = `uploads/R-${uuidv4()}.${ext}`;
    const recordUrl = `${process.env.BASE_URL}:${process.env.BASE_URL_PORT}/${recordName}`;

    file.mv(`./${recordName}`, (err) => {
        if(err) {
            return res.status(201).json({
                status: "Gagal",
                message: "File gagal diupload"
            });
        }
    })

    const id = "D-" + uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newDetection = {
        id,
        lat: latitude,
        lon: longitude,
        recordUrl,
        type,
        isValid,
        status,
        userId,
        createdAt,
        updatedAt
    };

    detections.push(newDetection);
    return res.json({
        status: "Sukses",
        message: "Data berhasil ditambahkan"
    });
}

export const detectionDetail = (req, res) => {
    const { id } = req.params

    const detectExist = detections.find((detect) => detect.id === id);
    if(detectExist !== undefined) {
        return res.json({
            status: "Sukses",
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
        id, isValid
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
    const userId = detectExist.userId
    const userRole = users.find((user) => user.id === userId);

    const updatedAt = new Date().toISOString();

    if (userRole !== "polisi" ||
	    userRole !== "ambulan" ||
		userRole !== "admin"
	) {
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
                message: "Tidak bisa menghapus file"
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
