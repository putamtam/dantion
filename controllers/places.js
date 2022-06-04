import { v4 as uuidv4 } from 'uuid';

export const placeAll = async (req, res) => {
    const queryDetectExist = `SELECT * FROM \`dangerdetection.dantion_big_query.places\``;
    let options = {
        query: queryDetectExist,
        location: 'asia-southeast2'
    };
    const [places] = await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "Berhasil mendapatkan data place",
        places: places
    });
}

export const placeAdd = async (req, res) => {
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

    const queryNewPlace = `INSERT \`dangerdetection.dantion_big_query.places\`
    (id, lat, lon, radius, type, createdAt, updatedAt) 
    VALUES (@id, @lat, @lon, @radius, @type, @createdAt, @updatedAt)`;

    options = {
        query: queryNewPlace,
        location: 'asia-southeast2',
        params: {
            id: id,
            lat: lat,
            lon: lon,
            radius: radius,
            type: type,
            createdAt: createdAt,
            updatedAt: updatedAt
        }
    };

    await bigqueryClient.query(options);
    
    return res.json({
        status: "Sukses",
        message: "Data berhasil ditambahkan"
    });
}

export const placeDetail = async (req, res) => {
    const { id } = req.params

    const queryPlaceExist = `SELECT * FROM \`dangerdetection.dantion_big_query.places\` WHERE id=@id`;
    let options = {
        query: queryPlaceExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [placeExist] = await bigqueryClient.query(options);
    if(placeExist.length !== 0) {
        return res.json({
            status: "Sukses",
            message: "Data berhasil ditemukan",
            place: placeExist[0] 
        });
    } else {
        return res.status(400).json({
            status: "Gagal",
            message: "Data tidak ditemukan"
        });
    }
}

export const placeUpdate = async (req, res) => {
    const {
        id, lat, lon, radius, type
    } = req.body;

    if(id === undefined || lat === undefined || lon === undefined || radius === undefined || type === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const queryPlaceExist = `SELECT * FROM \`dangerdetection.dantion_big_query.places\` WHERE id=@id`;
    let options = {
        query: queryPlaceExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [placeExist] = await bigqueryClient.query(options);
    if(placeExist.length === 0) {
        return res.json({
            status: "Gagal",
            message: "Data tidak ditemukan" 
        });
    }

    const updatedAt = new Date().toISOString();

    const queryUpdate = `UPDATE \`dangerdetection.dantion_big_query.places\`
    SET lat=@lat, lon=@lon, radius=@radius, type=@type, updatedAt=@updatedAt WHERE id=@id`;
    options = {
        query: queryUpdate,
        location: 'asia-southeast2',
        params: { 
            id: id,
            lat: lat,
            lon: lon,
            radius: radius,
            type: type, 
            updatedAt: new Date().toISOString()
        }
    };
    await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "Data berhasil diupdate"
    });
}

export const placeDelete = async (req, res) => {
    const { id } = req.params;
    
    if(id === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const queryPlaceExist = `SELECT * FROM \`dangerdetection.dantion_big_query.places\` WHERE id=@id`;
    let options = {
        query: queryPlaceExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [placeExist] = await bigqueryClient.query(options);
    if(placeExist.length === 0) {
        return res.status(400).json({
            status: "Gagal",
            message: "Data tidak ditemukan"
        });
    }
    
    const queryDeletePlace = `DELETE \`dangerdetection.dantion_big_query.places\` WHERE id=@id`;
    options = {
        query: queryDeletePlace,
        location: 'asia-southeast2',
        params: { id: id }
    };
    await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "Data berhasil dihapus"
    });
}
