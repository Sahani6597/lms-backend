import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { courseCreate, getCourses, getSingleCourse, updateCourse, deleteCourse } from "../controllers/CourseController.js";

const router = express.Router();

// Create a new course (Protected)
router.post("/courses", protect,courseCreate);

// Get all courses
router.get("/courses",getCourses);

// Get a single course by ID
router.get("/courses/:id", getSingleCourse);

// Update a course by ID (Protected)
router.put("/courses/:id", protect, updateCourse);

// Delete a course by ID (Protected)
router.delete("/courses/:id", protect,deleteCourse);

export default router;
