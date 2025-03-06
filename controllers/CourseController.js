import Course from "../models/Course.js";

// Create a new course
export const courseCreate = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const { search } = req.query; // Get search query from request

    let query = {}; // Default: empty query (fetch all courses)

    // If a search term is provided, filter courses by title or instructor
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } }, // Case-insensitive title search
          { instructor: { $regex: search, $options: "i" } }, // Case-insensitive instructor search
        ],
      };
    }

    const courses = await Course.find(query); // Fetch courses based on query
    res.json(courses); // Send response
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single course by ID
export const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a course by ID
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a course by ID
export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
