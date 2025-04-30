import express from 'express';
import QuizScore from '../models/QuizScore.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Save or update quiz score
router.post('/quiz-scores', protect, async (req, res) => {
  try {
    const { quizId, score } = req.body;

    if (!quizId || score === undefined) {
      return res.status(400).json({ message: 'QuizId and score are required' });
    }

    let quizScore = await QuizScore.findOne({ user: req.user._id, quizId });

    if (quizScore) {
      // Update existing score
      quizScore.score = score;
      quizScore.bestScore = Math.max(quizScore.bestScore, score);
    } else {
      // Create new score entry
      quizScore = new QuizScore({
        user: req.user._id,
        quizId,
        score,
        bestScore: score,
      });
    }

    await quizScore.save();
    res.status(201).json(quizScore);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's quiz scores
router.get('/quiz-scores', protect, async (req, res) => {
  try {
    const quizScores = await QuizScore.find({ user: req.user._id });
    res.status(200).json(quizScores);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;