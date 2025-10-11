import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  text: String,
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);