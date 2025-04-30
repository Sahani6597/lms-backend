import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isInstructorOrAdmin } from "../middleware/roleMiddleware.js";
import { 
    courseCreate, 
    getCourses, 
    getSingleCourse, 
    updateCourse, 
    deleteCourse, 
    getInstructorCourses,
    getInstructorStats 
} from "../controllers/CourseController.js";

const router = express.Router();

// Create a new course (Protected - Instructors & Admins only)
router.post("/courses", protect, isInstructorOrAdmin, courseCreate);

// Get instructor's courses (Protected - Instructors & Admins only)
router.get("/instructor/courses", protect, isInstructorOrAdmin, getInstructorCourses);

// Get all courses
router.get("/courses", getCourses);

// Get a single course by ID
router.get("/courses/:id", getSingleCourse);

// Update a course by ID (Protected - Instructors & Admins only)
router.put("/courses/:id", protect, isInstructorOrAdmin, updateCourse);

// Delete a course by ID (Protected - Instructors & Admins only)
router.delete("/courses/:id", protect, isInstructorOrAdmin, deleteCourse);

// Get instructor stats (Protected - Instructors & Admins only)
router.get("/instructor/stats", protect, isInstructorOrAdmin, getInstructorStats);

export default router;
