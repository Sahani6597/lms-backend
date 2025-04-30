import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  bookSession, 
  getUserSessions, 
  acceptSession, 
  getPendingRequests,
  updateSessionStatus,
  getInstructorPendingRequests,
  getInstructorSessions
} from '../controllers/guideController.js';
import { requestLogger } from '../middleware/loggingMiddleware.js';

const router = express.Router();

// Add logging middleware
router.use(requestLogger);

// Reorder routes - more specific routes first
router.get('/sessions/instructor/all', protect, getInstructorSessions);
router.get('/sessions/instructor/pending', protect, getInstructorPendingRequests);
router.get('/sessions', protect, getUserSessions);
router.post('/sessions', protect, bookSession);
router.put('/sessions/:id/accept', protect, acceptSession);
router.put('/sessions/:id/status', protect, updateSessionStatus);

export default router;
