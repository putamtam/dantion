import express from 'express';
import { authenticateToken } from './auth.js';

import {
	userAll,
	userRegister,
	userLogin,
	userDetail,
	userUpdate,
    userUpdatePhoto,
    userUpdatePassword,
} from "../controllers/users.js";

const router = express.Router();

router.get('/', userAll);
router.get('/:id', authenticateToken, userDetail);
router.post('/register', userRegister);
router.post('/login', userLogin);
router.patch('/', authenticateToken, userUpdate);
router.patch("/photo", authenticateToken, userUpdatePhoto);
router.patch("/password", authenticateToken, userUpdatePassword);

export default router;
