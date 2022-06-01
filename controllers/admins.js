import { generateAccessToken } from '../routes/auth.js';
import { hashPassword, checkPassword } from '../utils/helpers.js';
import { v4 as uuidv4 } from 'uuid';
import { admins, users } from '../models/dantion.js';

export const adminRegister = (req, res) => {
    const {
        name, email, password
    } = req.body;
    
    if (name === undefined || email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal menambahkan admin. Mohon isi data dengan benar"
        });
    }

    const adminExist = admins.find((admin) => admin.email === email);
    if(adminExist !== undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal menambahkan admin. Email sudah terdaftar"
        });
    }
    const id = `admin-${uuidv4()}`;
    const hashPass = hashPassword(password);
    const newadmin = {
			id,
			name,
			email,
			password: hashPass,
		};

    admins.push(newadmin);

    return res.json({
        status: "Sukses",
        message: "admin berhasil ditambahkan"
    });
}

export const adminLogin = (req, res) => {
    const { email, password } = req.body

    if(email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Isi data dengan benar"
        });
    }

    const adminExist = admins.find((admin) => admin.email === email);
    if(adminExist === undefined) {
        return res.status(201).json({
            status: "Sukses",
            message: "admin tidak terdaftar"
        });
    }

    else if(!checkPassword(password, adminExist.password)) {
        return res.status(201).json({
            status: "Gagal",
            message: "Login gagal"
        });
    } 
    
    else {
        const admin = { id: adminExist.id };
        const accessToken = generateAccessToken(admin);

        return res.json({
            status: "Sukses",
            loginResult: {
                id: adminExist.id,
                name: adminExist.name,
                email: adminExist.email,
                token: accessToken
            }
        });
    }
}
export const adminUpdate = (req, res) => {
    const {
        id, name, email, password
    } = req.body;
    if (id === undefined || name === undefined || email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Gagal mengupdate admin. Mohon isi data dengan benar"
        });
    }
    const adminExist = admins.find((admin) => admin.id === id);
    if(adminExist === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "admin tidak ditemukan"
        });
    } 
    adminExist.name = name;
    adminExist.email = email;
    adminExist.password = hashPassword(password);

    return res.json({
        status: "Sukses",
        message: "admin berhasil diupdate"
    });
}

export const adminUpdateUserRole = (req, res) => {
	const { userId, role } = req.body;
	if (userId === undefined || role === undefined) {
		return res.status(400).json({
			status: "Gagal",
			message: "Gagal mengupdate user. Mohon isi data dengan benar",
		});
	}
	const userExist = users.find((user) => user.id === userId);
	if (userExist === undefined) {
		return res.status(400).json({
			status: "Gagal",
			message: "User tidak ditemukan",
		});
	}
	userExist.role = role;
	return res.json({
		status: "Sukses",
		message: "Role User berhasil diupdate",
	});
};
