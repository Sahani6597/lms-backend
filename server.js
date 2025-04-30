import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import enrollments from "./routes/enrollments.js";
import quizRoute from "./routes/quizRoute.js";
// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/guide",guideRoutes);
app.use("/api/", courseRoutes);
app.use("/api/", enrollments);
app.use("/api/",quizRoute)

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
