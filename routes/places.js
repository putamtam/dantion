import express from 'express';
import { authenticateToken } from './auth.js';

import { 
    placeAll,
    placeAdd,
    placeDetail,
    placeUpdate,
    placeDelete
} from '../controllers/places.js';

const router = express.Router();

router.get('/', authenticateToken, placeAll);
router.get('/:id', authenticateToken, placeDetail);
router.post('/', authenticateToken, placeAdd);
router.patch('/', authenticateToken, placeUpdate);
router.delete('/:id', authenticateToken, placeDelete);

export default router;
