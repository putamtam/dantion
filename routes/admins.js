import express from 'express';
import { authenticateToken } from './auth.js';

import {
	adminLogin,
	adminUpdateUserRole,
} from "../controllers/admins.js";

const router = express.Router();

router.post('/login', adminLogin);
router.patch('/userRole', authenticateToken, adminUpdateUserRole);

export default router;
