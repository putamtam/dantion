import express from 'express';
import { authenticateToken } from './auth.js';

import { 
    userAll,
    userRegister,
    userLogin,
    userDetail,
    userUpdate
} from '../controllers/users.js';

const router = express.Router();

router.get('/', userAll);
router.get('/:id', authenticateToken, userDetail);
router.post('/register', userRegister);
router.post('/login', userLogin);
router.patch('/', authenticateToken, userUpdate);

export default router;
