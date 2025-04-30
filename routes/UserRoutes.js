import express from "express";
import { registerUser, loginUser, logoutUser, getInstructors, getAllUsers, deleteUser } from "../controllers/UserController.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/instructors", getInstructors);

// Admin routes
router.get("/listofusers", protect, isAdmin, getAllUsers);
router.delete("/:id", protect, isAdmin, deleteUser);

export default router;
