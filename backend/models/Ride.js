// models/rideModel.js
const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  seatsAvailable: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" , default: [] }]
}, { timestamps: true });

module.exports = mongoose.model("Ride", rideSchema);
