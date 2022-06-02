import { generateAccessToken } from '../routes/auth.js';
import { hashPassword, checkPassword } from '../utils/helpers.js';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from "@google-cloud/storage";
import { bigqueryClient } from '../index.js';

export const userAll = async (req, res) => {
    const {id} = req.body
    
    const queryAdminExist = `SELECT COUNT(email) AS emailCount FROM \`dangerdetection.dantion_big_query.admins\` WHERE id=@id`;
    let options = {
        query: queryAdminExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [adminsExist] = await bigqueryClient.query(options);
    if (adminsExist.emailCount === 0){
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal melihat user, Anda tidak berhak",
        });
    }

    const queryUserAll = `SELECT * FROM \`dangerdetection.dantion_big_query.users\``;
    options = {
        query: queryUserAll,
        location: 'asia-southeast2'
    };
    const [users] = await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "Berhasil Mendapatkan Semua User",
        users
    });
}

export const userRegister = async (req, res) => {
    const {
        name, address, number, parentNumber, email, password
    } = req.body;
    const role = "umum"
    
    if (name === undefined || address === undefined || number === undefined || parentNumber === undefined || email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal menambahkan user. Mohon isi data dengan benar"
        });
    }

    const queryUserExist = `SELECT COUNT(email) AS emailCount FROM \`dangerdetection.dantion_big_query.users\` WHERE email=@email`;
    let options = {
        query: queryUserExist,
        location: 'asia-southeast2',
        params: { email: email }
    };
    const [userExist] = await bigqueryClient.query(options);

    if(userExist[0].emailCount !== 0) {
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal menambahkan user. Email sudah terdaftar"
        });
    }

    const id = `U-${uuidv4()}`;
    const photo = '';
    const hashPass = hashPassword(password);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const queryNewUser = `INSERT \`dangerdetection.dantion_big_query.users\`
    (id, name, address, number, parentNumber, email, password, role, photo, createdAt, updatedAt) 
    VALUES (@id, @name, @address, @number, @parentNumber, @email, @password, @role, @photo, @createdAt, @updatedAt)`;

    options = {
        query: queryNewUser,
        location: 'asia-southeast2',
        params: {
            id: id, 
            name: name,
            address: address, 
            number: number,
            parentNumber: parentNumber, 
            email: email,
            password: hashPass, 
            role: role,
            photo: photo, 
            createdAt: createdAt,
            updatedAt: updatedAt
        }
    };

    await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "User berhasil ditambahkan"
    });
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body

    if(email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Isi data dengan benar"
        });
    }

    const queryUserExist = `SELECT id, name, email, password FROM \`dangerdetection.dantion_big_query.users\` WHERE email=@email`;
    let options = {
        query: queryUserExist,
        location: 'asia-southeast2',
        params: { email: email }
    };
    const [rUserExist] = await bigqueryClient.query(options);

    if(rUserExist.length === 0) {
        return res.status(201).json({
            status: "Sukses",
            message: "User tidak terdaftar"
        });
    }

    const userExist = rUserExist[0];
    if(!checkPassword(password, userExist.password)) {
        return res.status(201).json({
            status: "Gagal",
            message: "Login gagal"
        });
    }

    else {
        const user = { id: userExist.id };
        const accessToken = generateAccessToken(user);

        return res.json({
            status: "Sukses",
            message: "Berhasil Login",
            loginResult: {
                id: userExist.id,
                name: userExist.name,
                email: userExist.email,
                token: accessToken
            }
        });
    }
}

export const userDetail = async (req, res) => {
    const { id } = req.params

    const queryUserExist = `SELECT * FROM \`dangerdetection.dantion_big_query.users\` WHERE id=@id`;
    let options = {
        query: queryUserExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [rUserExist] = await bigqueryClient.query(options);

    if(rUserExist.length !== 0) {
        const userExist = rUserExist[0];
        console.log(userExist);
        return res.json({
					status: "Sukses",
                    message: "Berhasil mendapatakan detail user",
					user: {
						id: userExist.id,
						name: userExist.name,
						address: userExist.address,
						number: userExist.number,
						parentNumber: userExist.parentNumber,
						email: userExist.email,
						password: userExist.password,
						photo: userExist.photo,
						createdAt: userExist.createdAt,
						updatedAt: userExist.updatedAt,
					},
				});
    } else {
        return res.status(400).json({
            status: "Gagal",
            message: "User tidak ditemukan"
        });
    }
}
export const userUpdate = async (req, res) => {
    const {
        id, name, address, number, parentNumber, email, password
    } = req.body;
    const file = req.files.photo;
    if (id === undefined || name === undefined || address === undefined || number === undefined || parentNumber === undefined || email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal memperbarui user. Mohon isi data dengan benar"
        });
    }
    
    const queryUserExist = `SELECT * FROM \`dangerdetection.dantion_big_query.users\` WHERE id=@id`;
    let options = {
        query: queryUserExist,
        location: 'asia-southeast2',
        params: { id: id }
    };
    const [rUserExist] = await bigqueryClient.query(options);
    if(rUserExist.length === 0) {
        return res.status(400).json({
            status: "Gagal",
            message: "User tidak ditemukan"
        });
    } 

    const userExist = rUserExist[0];

    let photoUrl='';
    if (file !== undefined && file !== null) {
        const storage = new Storage({ keyFilename: "gcp-storage.json" });
        const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
        const ext = file.name.split(".").filter(Boolean).slice(1).join(".");
        const photoName = `PP-${userExist.id}.${ext}`;
        photoUrl = `https://storage.googleapis.com/${bucket.name}/users/${photoName}`;

        const blob = bucket.file(`users/${photoName}`);
        const blobStream = blob.createWriteStream();

        blobStream.on("error", (err) => {
            return res.status(400).json({
                status: "Gagal",
                message: err,
            });
        });

        blobStream.on("finish", () => {});
        blobStream.end(file.data);
    }

    const queryUpdate = `UPDATE \`dangerdetection.dantion_big_query.users\`
    SET name=@name, address=@address, number=@number, parentNumber=@parentNumber, email=@email, password=@password, photo=@photo, updatedAt=@updatedAt
    WHERE id=@id`;
    options = {
        query: queryUpdate,
        location: 'asia-southeast2',
        params: { 
            id: id, 
            name: name,
            address: address, 
            number: number,
            parentNumber: parentNumber, 
            email: email,
            password: hashPassword(password), 
            photo: photoUrl,
            updatedAt: new Date().toISOString()
        }
    };
    await bigqueryClient.query(options);

    return res.json({
        status: "Sukses",
        message: "User berhasil diupdate"
    });
}
