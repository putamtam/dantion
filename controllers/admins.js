import { generateAccessToken } from '../routes/auth.js';
import { checkPassword } from '../utils/helpers.js';
import { admins, users } from '../models/dantion.js';

export const adminLogin = (req, res) => {
    const { email, password } = req.body
    const adminExist = admins.find((admin) => admin.email === email);
    
    if(email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    if(adminExist === undefined) {
        return res.status(201).json({
            status: "Sukses",
            message: "Admin tidak terdaftar"
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
            message: "Berhasil Login",
            loginResult: {
                id: adminExist.id,
                name: adminExist.name,
                email: adminExist.email,
                token: accessToken
            }
        });
    }
}
export const adminUpdateUserRole = (req, res) => {
	const { userId, role } = req.body;
	if (userId === undefined || role === undefined) {
		return res.status(400).json({
			status: "Gagal",
			message: "Gagal memperbarui role user. Mohon isi data dengan benar",
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
		message: "Role User berhasil diperbarui",
	});
};
