// models/reviewModel.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewed: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: false },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  role: { type: String, enum: ['driver', 'passenger'], required: true }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
