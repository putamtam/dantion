import express from 'express';
import { authenticateToken } from './auth.js';

import {
	adminRegister,
	adminLogin,
	adminUpdate,
	adminUpdateUserRole,
} from "../controllers/admins.js";

const router = express.Router();

router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.patch('/', authenticateToken, adminUpdate);
router.patch('/userRole', authenticateToken, adminUpdateUserRole);

export default router;
