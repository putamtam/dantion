import { generateAccessToken } from '../routes/auth.js';
import { hashPassword, checkPassword } from '../utils/helpers.js';
import { v4 as uuidv4 } from 'uuid';
import { users } from '../models/dantion.js';

export const userAll = (req, res) => {
    return res.json({
        status: "Sukses",
        users: users
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
        createdAt,
        updatedAt
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
            user: {
                id: userExist.id,
                name: userExist.name,
                address: userExist.address,
                number: userExist.number,
                parentNumber: userExist.parentNumber,
                email: userExist.email
            }
        });
    } else {
        return res.status(400).json({
            status: "Gagal",
            message: "User tidak ditemukan"
        });
    }
}
export const userUpdateRole = (req, res) => {
	const { id, role} = req.body;
	if ( id === undefined || role === undefined) {
		return res.status(400).json({
			status: "Gagal",
			message: "Gagal mengupdate user. Mohon isi data dengan benar",
		});
	}
	const userExist = users.find((user) => user.id === id);
	if (userExist === undefined) {
		return res.status(400).json({
			status: "Gagal",
			message: "User tidak ditemukan",
		});
	}
	userExist.role = role;

	return res.json({
		status: "Sukses",
		message: "User berhasil diupdate",
	});
};

export const userUpdate = (req, res) => {
    const {
        id, name, address, number, parentNumber, email, password
    } = req.body;

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
    
    userExist.name = name;
    userExist.address = address;
    userExist.number = number;
    userExist.parentNumber = parentNumber;
    userExist.email = email;
    userExist.password = hashPassword(password);

    return res.json({
        status: "Sukses",
        message: "User berhasil diupdate"
    });
}
