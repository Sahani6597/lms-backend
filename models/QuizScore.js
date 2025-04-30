import mongoose from "mongoose";

const QuizScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  bestScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('QuizScore', QuizScoreSchema);