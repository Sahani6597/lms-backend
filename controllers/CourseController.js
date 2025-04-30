import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// Create a new course
export const courseCreate = async (req, res) => {
  try {
    // Check if user is an instructor
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only instructors can create courses" });
    }

    const courseData = {
      ...req.body,
      instructor: req.user._id // Set the instructor ID from the authenticated user
    };

    const course = await Course.create(courseData);
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
          // Search instructor name through population
        ],
      };
    }

    const courses = await Course.find(query).populate('instructor', 'name email'); // Populate instructor details
    res.json(courses); // Send response
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single course by ID
export const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
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
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is admin or the course instructor
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get courses created by the logged-in instructor
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get enrolled students for instructor's courses
export const getEnrolledStudents = async (req, res) => {
  try {
    const instructorId = req.user.id;
    
    const enrollments = await Enrollment.find()
      .populate('courseId', 'title')
      .populate('userId', 'name email')
      .populate({
        path: 'courseId',
        match: { instructor: instructorId }
      })
      .exec();

    // Filter out null courseId (courses that don't belong to instructor)
    const validEnrollments = enrollments.filter(e => e.courseId !== null);

    res.json(validEnrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrolled students" });
  }
};

// Add this new controller function
export const getInstructorStats = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get total courses
    const totalCourses = await Course.countDocuments({ instructor: instructorId });

    // Get total enrolled students across all courses
    const coursesByInstructor = await Course.find({ instructor: instructorId });
    const courseIds = coursesByInstructor.map(course => course._id);
    
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courseIds }
    });

    // Get enrollment stats per course
    const enrollmentStats = await Course.aggregate([
      { $match: { instructor: instructorId } },
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'enrollments'
        }
      },
      {
        $project: {
          title: 1,
          totalEnrolled: { $size: '$enrollments' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        courseStats: enrollmentStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};
