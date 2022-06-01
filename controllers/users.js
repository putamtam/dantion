import { generateAccessToken } from '../routes/auth.js';
import { hashPassword, checkPassword } from '../utils/helpers.js';
import { v4 as uuidv4 } from 'uuid';
import { users, admins } from '../models/dantion.js';

export const userAll = (req, res) => {
    const {id} = req.params
    const adminsExist = admins.find((admin) => admin.id === id);
    if (adminsExist === undefined){
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal melihat user, Anda tidak berhak",
        });
    }
    return res.json({
        status: "Sukses",
        message: "Berhasil Mendapatkan Semua User",
        users
    });
}

export const userRegister = (req, res) => {
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

    const userExist = users.find((user) => user.email === email);
    if(userExist !== undefined) {
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
    const newUser = {
        id,
        name,
        address,
        number,
        parentNumber,
        email,
        password: hashPass,
        role,
        photo,
        createdAt,
        updatedAt,
    };

    users.push(newUser);

    return res.json({
        status: "Sukses",
        message: "User berhasil ditambahkan"
    });
}

export const userLogin = (req, res) => {
    const { email, password } = req.body

    if(email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Isi data dengan benar"
        });
    }

    const userExist = users.find((user) => user.email === email);
    if(userExist === undefined) {
        return res.status(201).json({
            status: "Sukses",
            message: "User tidak terdaftar"
        });
    }

    else if(!checkPassword(password, userExist.password)) {
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

export const userDetail = (req, res) => {
    const { id } = req.params

    const userExist = users.find((user) => user.id === id);

    if(userExist !== undefined) {
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

export const userUpdate = (req, res) => {
    const {
        id, name, address, number, parentNumber, email, password
    } = req.body;
    const file = req.files.photo;
    if (id === undefined || name === undefined || address === undefined || number === undefined || parentNumber === undefined || email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal mengupdate user. Mohon isi data dengan benar"
        });
    }
    const userExist = users.find((user) => user.id === id);
    if(userExist === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "User tidak ditemukan"
        });
    } 
    let photoUrl='';
    if (file !== undefined && file !== null) {
        const ext = file.name.split(".").filter(Boolean).slice(1).join(".");
        const photoName = `uploads/${userExist.id}.${ext}`;
        photoUrl = `${process.env.BASE_URL}:${process.env.BASE_URL_PORT}/${photoName}`;

        file.mv(`./${photoName}`, (err) => {
            if (err) {
                return res.status(400).json({
                    status: "Gagal",
                    message: "File gagal diupload",
                });
            }
        });
    }
    userExist.name = name;
    userExist.address = address;
    userExist.number = number;
    userExist.parentNumber = parentNumber;
    userExist.email = email;
    userExist.photo = photoUrl;
    userExist.password = hashPassword(password);

    return res.json({
        status: "Sukses",
        message: "User berhasil diupdate"
    });
}
