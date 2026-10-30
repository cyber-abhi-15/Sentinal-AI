// server/src/routes/firewall.js
import { Router } from 'express';
import { z } from 'zod';
import { optionalAuth } from '../middleware/auth.js';
import { scan, process } from '../controllers/firewallController.js';

const router = Router();

const scanSchema = z.object({
  input: z.string().min(1, 'Input cannot be empty').max(5000, 'Input exceeds maximum allowed length of 5000 characters'),
  policy: z.enum(['STRICT', 'BALANCED', 'PERMISSIVE']).default('BALANCED'),
  requestGemini: z.boolean().default(false)
});

function validateScan(req, res, next) {
  const parsed = scanSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten().fieldErrors
    });
  }
  req.body = parsed.data;
  next();
}

router.post('/scan', optionalAuth, validateScan, scan);
router.post('/process', optionalAuth, validateScan, process);

export default router;

