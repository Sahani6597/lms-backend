import express from "express";
import { enrollCourse, getUserEnrollments, updateProgress, checkEnrollmentStatus, unenrollCourse } from "../controllers/enrollmentController.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
 
router.get('/enrollments',  protect , getUserEnrollments);
router.post('/enrollments',  protect, enrollCourse);
router.patch('/enrollments/:enrollmentId/progress',  protect , updateProgress);
router.get('/enrollments/check/:courseId', protect, checkEnrollmentStatus);
router.delete('/enrollments/:courseId', protect, unenrollCourse);

export default router;
