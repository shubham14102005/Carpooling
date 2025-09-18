// routes/rideRoutes.js
const express = require("express");
const { 
  createRide, 
  getRides, 
  getRideById,
  searchRides, 
  getReviewableRides,
  joinRide, 
  bookRide,
  cancelRide
} = require("../controllers/rideController");
const auth = require("../middleware/auth");
const router = express.Router();

// POST - create ride (protected)
router.post("/", auth, createRide);

// GET - fetch all rides (public)
router.get("/", getRides);


// GET - search rides (public)
router.get("/search", searchRides);


// GET - rides where user can give reviews (protected)
router.get("/user/:userId/reviewable", auth, getReviewableRides);

// POST - join ride (protected)
router.post("/join", auth, joinRide);

// POST - book ride (protected)
router.post("/:rideId/book", auth, bookRide);

// PUT - cancel ride (protected)
router.put("/:rideId/cancel", auth, cancelRide);

// GET - get ride by ID (public) - must come after specific routes
router.get("/:id", getRideById);

module.exports = router;
