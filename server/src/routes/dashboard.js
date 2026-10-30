// server/src/routes/dashboard.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getStats, getDistribution, getActivity } from '../controllers/dashboardController.js';

const router = Router();

router.get('/stats', authenticateToken, getStats);
router.get('/distribution', authenticateToken, getDistribution);
router.get('/activity', authenticateToken, getActivity);

export default router;

