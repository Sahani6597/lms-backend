import Guide from '../models/Guide.js';

// Book a new session
export const bookSession = async (req, res) => {
  try {
    const { topic, timeSlot, notes } = req.body;
    const userId = req.user._id; // Assuming auth middleware is applied
    console.log(userId)
    const session = await Guide.create({
      user:userId,
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
    const sessions = await Guide.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};