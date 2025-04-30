import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import mongoose from 'mongoose';

export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!courseId || !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing course ID' });
    }

    const course = await Course.findById(courseId);
    console.log('Course found:', course);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
    console.log('Existing Enrollment:', existingEnrollment);

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ user: userId, course: courseId });

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course',
      data: enrollment,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in course',
      error: error.message,
    });
  }
};


export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title instructor image')
      .sort('-createdAt');

    if (enrollments.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'You are enrolled in these courses',
        data: enrollments
      });
    }

    res.status(200).json({
      success: true,
      message: 'You are not enrolled in any courses yet',
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findOneAndUpdate(
      {
        _id: enrollmentId,
        user: req.user._id
      },
      {
        progress,
        status: progress === 100 ? 'completed' : 'in-progress',
        lastAccessed: Date.now()
      },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create new enrollment if not exists
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId
    });

    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

export const checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    res.status(200).json({
      success: true,
      isEnrolled: !!enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking enrollment status',
      error: error.message
    });
  }
};

export const unenrollCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const result = await Enrollment.findOneAndDelete({
      user: userId,
      course: courseId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from the course'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unenrolling from course',
      error: error.message
    });
  }
};
