// controllers/rideController.js
const Ride = require("../models/Ride");

// Create a new ride
exports.createRide = async (req, res) => {
  try {
    const ride = new Ride({
      driver: req.user.id, // Use authenticated user ID
      origin: req.body.origin,
      destination: req.body.destination,
      date: req.body.date,
      time: req.body.time,
      seatsAvailable: req.body.seatsAvailable,
      price: req.body.price,
      description: req.body.description
    });
    await ride.save();
    
    // Populate driver info before sending response
    const populatedRide = await Ride.findById(ride._id).populate("driver", "name email");
    res.status(201).json(populatedRide);
  } catch (err) {
    res.status(500).json({ message: "Error creating ride", error: err.message });
  }
};

// Get all rides
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate("driver", "name email");
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rides", error: err.message });
  }
};

// Get ride by ID
exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("driver", "name email phone");
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ride", error: err.message });
  }
};

// Search rides by origin/destination
exports.searchRides = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    const rides = await Ride.find({
      origin: { $regex: origin, $options: "i" },
      destination: { $regex: destination, $options: "i" }
    }).populate("driver", "name email");
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: "Error searching rides", error: err.message });
  }
};


// Get rides where user can give reviews
exports.getReviewableRides = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get rides where user is driver or passenger and ride is completed
    const driverRides = await Ride.find({ 
      driver: userId, 
      status: 'completed' 
    }).populate("passengers", "name email");
    
    const passengerRides = await Ride.find({ 
      passengers: userId, 
      status: 'completed' 
    }).populate("driver", "name email");
    
    // Combine and format rides
    const reviewableRides = [
      ...driverRides.map(ride => ({ ...ride.toObject(), userRole: 'driver' })),
      ...passengerRides.map(ride => ({ ...ride.toObject(), userRole: 'passenger' }))
    ];
    
    res.json(reviewableRides);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviewable rides", error: err.message });
  }
};

// Join a ride
exports.joinRide = async (req, res) => {
  try {
    const { rideId } = req.body;
    const userId = req.user.id; // Use authenticated user ID
    
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Check if user is already a passenger
    if (ride.passengers.includes(userId)) {
      return res.status(400).json({ message: "Already joined this ride" });
    }

    ride.passengers.push(userId);
    ride.seatsAvailable -= 1;
    await ride.save();

    res.json({ message: "Successfully joined ride", ride });
  } catch (err) {
    res.status(500).json({ message: "Error joining ride", error: err.message });
  }
};

// Book a ride (same as join ride but with different endpoint)
exports.bookRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const userId = req.user.id;

    // Use atomic update to avoid triggering full-document validation
    const existing = await Ride.findById(rideId).select('driver seatsAvailable passengers');
    if (!existing) return res.status(404).json({ message: "Ride not found" });

    // Prevent driver from booking their own ride
    if (existing.driver.toString() === userId) {
      return res.status(400).json({ message: "You cannot book your own ride" });
    }

    if (existing.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Check if user is already a passenger
    if (Array.isArray(existing.passengers) && existing.passengers.some(p => p.toString() === userId)) {
      return res.status(400).json({ message: "Already booked this ride" });
    }

    // Perform atomic update: push passenger and decrement seats
    const updated = await Ride.findByIdAndUpdate(
      rideId,
      {
        $push: { passengers: userId },
        $inc: { seatsAvailable: -1 }
      },
      { new: true }
    ).populate('driver', 'name email phone');

  // booking succeeded

    res.json({ message: "Ride booked successfully", ride: updated });
  } catch (err) {
    console.error("Error booking ride:", err);
    res.status(500).json({ message: "Error booking ride", error: err.message });
  }
};

// Cancel a ride
exports.cancelRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const userId = req.user.id;
    
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // Check if user is the driver
    if (ride.driver.toString() !== userId) {
      return res.status(403).json({ message: "Only the driver can cancel the ride" });
    }

    ride.status = 'cancelled';
    await ride.save();

    res.json({ message: "Ride cancelled successfully", ride });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling ride", error: err.message });
  }
};
