import Guide from '../models/Guide.js';
import User from '../models/User.js';
// Book a new session
export const bookSession = async (req, res) => {
  try {
    const { instructor,topic, timeSlot, notes } = req.body;
    const userId = req.user._id; // Assuming auth middleware is applied
    console.log(userId)
    const session = await Guide.create({
      user:userId,
      instructor,
      topic,
      timeSlot,
      notes,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error in bookSession:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking session',
      error: error.message
    });
  }
};

// Get user's sessions
export const getUserSessions = async (req, res) => {
  try {
    console.log('Fetching sessions for user:', req.user._id);
    const sessions = await Guide.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    console.log('Found sessions:', sessions.length);
    
    if (!sessions) {
      return res.status(404).json({
        success: false,
        message: 'No sessions found'
      });
    }

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    console.error('Error in getUserSessions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};

// Accept a session request
export const acceptSession = async (req, res) => {
  try {
    const session = await Guide.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'confirmed',
        instructor: req.user._id 
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error in acceptSession:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting session',
      error: error.message
    });
  }
};

// Get pending guidance requests
export const getPendingRequests = async (req, res) => {
  try {
    const sessions = await Guide.find({ status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending requests',
      error: error.message
    });
  }
};

export const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Guide.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session status',
      error: error.message
    });
  }
};

// Get instructor's pending guidance requests
export const getInstructorPendingRequests = async (req, res) => {
  try {
    const sessions = await Guide.find({
      instructor: req.user._id,
      status: 'pending'
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor pending requests',
      error: error.message
    });
  }
};

// Get all instructor's sessions
export const getInstructorSessions = async (req, res) => {
  try {
    const sessions = await Guide.find({
      instructor: req.user._id
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor sessions',
      error: error.message
    });
  }
};