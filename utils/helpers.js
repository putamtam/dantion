import bcrypt from 'bcrypt';

export function hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

export function checkPassword(pass, hash) {
    return bcrypt.compareSync(pass, hash);
}