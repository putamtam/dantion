import { generateAccessToken } from '../routes/auth.js';
import { checkPassword } from '../utils/helpers.js';

export const adminLogin = async (req, res) => {
    const { email, password } = req.body
    
    if(email === undefined || password === undefined) {
        return res.status(400).json({
            status: "Gagal",
            message: "Masukkan data dengan benar"
        });
    }

    const queryAdminExist = `SELECT id, name, email, password FROM \`dantion.dantion_big_query.admins\` WHERE email=@email`;
    let options = {
        query: queryAdminExist,
        location: 'asia-southeast2',
        params: { email: email }
    };
    const [rAdminExist] = await bigqueryClient.query(options);
    if(rAdminExist.length === 0) {
        return res.status(201).json({
            status: "Sukses",
            message: "Admin tidak terdaftar"
        });
    }

    const adminExist = rAdminExist[0];
    if(!checkPassword(password, adminExist.password)) {
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
export const adminUpdateUserRole = async (req, res) => {
	const { userId, role } = req.body;
	if (userId === undefined || role === undefined) {
		return res.status(400).json({
			status: "Gagal",
			message: "Gagal memperbarui role user. Mohon isi data dengan benar",
		});
	}

	const queryUserExist = `SELECT * FROM \`dantion.dantion_big_query.users\` WHERE id=@id`;
    let options = {
        query: queryUserExist,
        location: 'asia-southeast2',
        params: { id: userId }
    };
    const [userExist] = await bigqueryClient.query(options);
	if (userExist.length === 0) {
		return res.status(400).json({
			status: "Gagal",
			message: "User tidak ditemukan",
		});
	}
	
    const queryUpdate = `UPDATE \`dantion.dantion_big_query.users\`
    SET role=@role, updatedAt=@updatedAt WHERE id=@id`;
    options = {
        query: queryUpdate,
        location: 'asia-southeast2',
        params: { 
            id: id, 
            role: role,
            updatedAt: new Date().toISOString()
        }
    };
    await bigqueryClient.query(options);

	return res.json({
		status: "Sukses",
		message: "Role User berhasil diperbarui",
	});
};
