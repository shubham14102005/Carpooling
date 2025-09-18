// controllers/reviewController.js
const Review = require("../models/review");
const Ride = require("../models/Ride");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { rating, comment, role } = req.body;
    
    // Validate required fields
    if (!rating || !comment || !role) {
      return res.status(400).json({ message: "Rating, comment, and role are required" });
    }

    
    // For simplified reviews, we'll create a review without specific ride or reviewed user
    const review = new Review({
      reviewer: req.user.id,
      reviewed: req.user.id, // For now, set as self-review
      ride: null, // No specific ride
      rating: rating,
      comment: comment,
      role: role // Add role field
    });
    

    await review.save();
    
    // Populate the review with user details
    const populatedReview = await Review.findById(review._id)
      .populate("reviewer", "name email");
    
  // created review

    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(500).json({ message: "Error creating review", error: err.message });
  }
};

// Get all reviews for a ride
exports.getReviewsByRide = async (req, res) => {
  try {
    const reviews = await Review.find({ ride: req.params.rideId })
      .populate("reviewer", "name email")
      .populate("reviewed", "name email")
      .populate("ride", "origin destination date");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

// Get all reviews written by a user
exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewer: req.user.id })
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });
  // fetched reviews for user
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ message: "Error fetching user reviews", error: err.message });
  }
};

// Get all reviews (public)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("reviewer", "name email")
      .sort({ createdAt: -1 });
  // fetched all reviews
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching all reviews:", err);
    res.status(500).json({ message: "Error fetching all reviews", error: err.message });
  }
};

// Get reviews where user is the driver (reviews about the user as a driver)
exports.getReviewsByDriver = async (req, res) => {
  try {
    
    // Find rides where the user is the driver
    const userRides = await Ride.find({ driver: req.params.userId });
    
    if (userRides.length === 0) {
      return res.json([]);
    }
    
    const rideIds = userRides.map(ride => ride._id);
    
    // Find reviews for those rides where the user is being reviewed
    const reviews = await Review.find({
      ride: { $in: rideIds },
      reviewed: req.params.userId
    })
    .populate("reviewer", "name email")
    .populate("ride", "origin destination date");
    
  // fetched driver reviews
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching driver reviews:", err);
    res.status(500).json({ message: "Error fetching driver reviews", error: err.message });
  }
};

// Get reviews where user is the passenger (reviews about the user as a passenger)
exports.getReviewsByPassenger = async (req, res) => {
  try {
    
    // Find rides where the user is a passenger
    const userRides = await Ride.find({ passengers: req.params.userId });
    
    if (userRides.length === 0) {
      return res.json([]);
    }
    
    const rideIds = userRides.map(ride => ride._id);
    
    // Find reviews for those rides where the user is being reviewed
    const reviews = await Review.find({
      ride: { $in: rideIds },
      reviewed: req.params.userId
    })
    .populate("reviewer", "name email")
    .populate("ride", "origin destination date");
    
  // fetched passenger reviews
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching passenger reviews:", err);
    res.status(500).json({ message: "Error fetching passenger reviews", error: err.message });
  }
};
