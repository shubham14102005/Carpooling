const User = require("../models/User");
const Ride = require("../models/Ride");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    
    // Create token for immediate login
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: "1d" }
    );
    
    res.status(201).json({ 
      message: "User registered successfully", 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key', 
      { expiresIn: "1d" }
    );
    
    res.json({ 
      message: "Login successful",
      token, 
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
  const { name, email, phone, address, dob } = req.body;
    const userId = req.params.id;

    // Check if user is updating their own profile
    if (req.user.id !== userId) {
      return res.status(403).json({ error: "You can only update your own profile" });
    }

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already taken" });
      }
    }

    const updatePayload = { name, email, phone };
    if (typeof address !== 'undefined') updatePayload.address = address;
    if (typeof dob !== 'undefined') updatePayload.dob = dob ? new Date(dob) : null;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatePayload,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
  // Get user's rides as driver
  const driverRides = await Ride.find({ driver: userId });

  // Get user's rides as passenger
  const passengerRides = await Ride.find({ passengers: userId });
    
    // Calculate stats
    const totalRides = driverRides.length + passengerRides.length;
    const totalEarnings = driverRides.reduce((sum, ride) => {
      const passengersCount = ride.passengers ? ride.passengers.length : 0;
      const filledSeats = ride.seatsAvailable - passengersCount;
      return sum + (ride.price * filledSeats);
    }, 0);
    
    // Get user's join date
    const user = await User.findById(userId);
    const memberSince = user ? user.createdAt : new Date();
    
    // Mock rating for now (in real app, this would be calculated from reviews)
    const averageRating = 4.5;
    
  // stats calculated
    
    res.json({
      totalRides,
      totalEarnings,
      averageRating,
      memberSince
    });
  } catch (err) {
    console.error("Get user stats error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

