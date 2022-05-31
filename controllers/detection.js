import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { detections } from '../models/dantion.js';

export const detectionAll = (req, res) => {
    return res.json({
        status: "Sukses",
        detections: detections
    });
}

export const detectionAdd = (req, res) => {
    const {
        latitude, longitude, type
    } = req.body;
    const file = req.files.record;

    if(latitude === undefined || longitude === undefined || file === undefined || file === null || type === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
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
        id, latitude, longitude, type
    } = req.body;
    const file = req.files.record;

    if(id === undefined || latitude === undefined || longitude === undefined || file === undefined || file === null || type === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const detectExist = detections.find((detect) => detect.id === id);
    if(detectExist === undefined) {
        return res.json({
            status: "Gagal",
            detection: "Data tidak ditemukan" 
        });
    }

    const recordName = detectExist.recordUrl.split('/').slice(3).join('/');
    file.mv(`./${recordName}`, function (err) {
        if(err) {
            return res.status(201).json({
                status: "Gagal",
                message: "File gagal diupload"
            });
        }
    })

    const updatedAt = new Date().toISOString();

    detectExist.lat = latitude;
    detectExist.lon = longitude;
    detectExist.type = type;
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

    detections.filter((detect) => detect.id !== id)
    return res.json({
        status: "Sukses",
        message: "Data berhasil dihapus"
    });
}