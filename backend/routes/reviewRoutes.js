// routes/reviewRoutes.js
const express = require("express");
const { createReview, getReviewsByRide, getReviewsByUser, getAllReviews, getReviewsByDriver, getReviewsByPassenger } = require("../controllers/reviewController");
const auth = require("../middleware/auth");
const router = express.Router();

// POST - create review (protected)
router.post("/", auth, createReview);

// GET - reviews for a ride (public)
router.get("/ride/:rideId", getReviewsByRide);

// GET - all reviews (public)
router.get("/all", getAllReviews);

// GET - reviews by user (protected)
router.get("/user", auth, getReviewsByUser);
router.get("/user/:userId", auth, getReviewsByUser);

// GET - reviews where user is the driver (protected)
router.get("/driver/:userId", auth, getReviewsByDriver);

// GET - reviews where user is the passenger (protected)
router.get("/passenger/:userId", auth, getReviewsByPassenger);

module.exports = router;
