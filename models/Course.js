import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  rating: Number,
  reviewsCount: Number,
  price: Number,
  image: String, 
  description: String,
  learningOutcomes: [String],
  modules: [{ title: String, duration: String }],
  instructorImage: String,
  instructorBio: String,
  reviews: [{ author: String, text: String }],
});

export default mongoose.model("Course", CourseSchema);
