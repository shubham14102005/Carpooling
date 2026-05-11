// index.js (main entry point)
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

// Load environment variables (force backend/.env regardless of CWD)
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Middleware
const corsOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const corsOptions = corsOrigins.length ? { origin: corsOrigins } : {};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    // Prefer env MONGO_URI/MONGODB_URI; otherwise fall back to local Compass/Community
    await mongoose.connect(process.env.MONGO_URI);
    if (process.env.SHOW_LOGS !== 'false') {
      console.log("✅ MongoDB connected successfully");
    }
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const rideRoutes = require("./routes/rideRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Server start
const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    if (process.env.SHOW_LOGS !== 'false') {
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Client URL: ${clientUrl}`);
    }
  });
