// server/src/routes/scans.js
import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { getScans, getScanById, deleteScan, clearScans } from '../controllers/scansController.js';

const router = Router();

router.get('/', optionalAuth, getScans);
router.delete('/clear', optionalAuth, clearScans);
router.get('/:id', optionalAuth, getScanById);
router.delete('/:id', optionalAuth, deleteScan);

export default router;
