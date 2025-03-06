import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { bookSession, getUserSessions } from '../controllers/guideController.js';

const router = express.Router();

// Protected routes
router.post('/sessions', protect, bookSession);
router.get('/sessions', protect, getUserSessions);

export default router;
