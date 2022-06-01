import { v4 as uuidv4 } from 'uuid';
import { places } from '../models/dantion.js';

export const placeAll = (req, res) => {
    return res.json({
        status: "Sukses",
        message: "Berhasil mendapatkan data place",
        places: places
    });
}

export const placeAdd = (req, res) => {
    const {
        lat, lon, radius, type
    } = req.body;

    if(lat === undefined || lon === undefined || radius === undefined || type === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const id = "P-" + uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newPlace = {
        id,
        lat,
        lon,
        radius,
        type,
        createdAt,
        updatedAt
    };

    places.push(newPlace);
    return res.json({
        status: "Sukses",
        message: "Data berhasil ditambahkan"
    });
}

export const placeDetail = (req, res) => {
    const { id } = req.params

    const placeExist = places.find((place) => place.id === id);
    if(placeExist !== undefined) {
        return res.json({
            status: "Sukses",
            message: "Data berhasil ditemukan",
            place: placeExist 
        });
    } else {
        return res.status(400).json({
            status: "Gagal",
            message: "Data tidak ditemukan"
        });
    }
}

export const placeUpdate = (req, res) => {
    const {
        id, lat, lon, radius, type
    } = req.body;

    if(id === undefined || lat === undefined || lon === undefined || radius === undefined || type === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const placeExist = places.find((place) => place.id === id);
    if(placeExist === undefined) {
        return res.json({
            status: "Gagal",
            message: "Data tidak ditemukan" 
        });
    }

    const updatedAt = new Date().toISOString();

    placeExist.lat = lat;
    placeExist.lon = lon;
    placeExist.radius = radius;
    placeExist.type = type;
    placeExist.updatedAt = updatedAt;

    return res.json({
        status: "Sukses",
        message: "Data berhasil diupdate"
    });
}

export const placeDelete = (req, res) => {
    const { id } = req.params;
    
    if(id === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const placeExist = places.findIndex((place) => place.id === id);
    if(placeExist < 0) {
        return res.status(400).json({
            status: "Gagal",
            message: "Data tidak ditemukan"
        });
    }
    places.splice(placeExist, 1);
    return res.json({
        status: "Sukses",
        message: "Data berhasil dihapus"
    });
}
