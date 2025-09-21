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

// Get ride by ID with detailed passenger info
exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate("driver", "name email phone")
      .populate("passengers", "name email phone");
    
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    
    // Group passengers by unique user to show booking details
    const passengerBookings = {};
    ride.passengers.forEach(passenger => {
      const passengerId = passenger._id.toString();
      if (passengerBookings[passengerId]) {
        passengerBookings[passengerId].seatsBooked += 1;
      } else {
        passengerBookings[passengerId] = {
          user: passenger,
          seatsBooked: 1
        };
      }
    });
    
    // Convert to array format
    const passengerList = Object.values(passengerBookings);
    
    res.json({
      ...ride.toObject(),
      passengerBookings: passengerList,
      totalPassengers: ride.passengers.length
    });
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



// Book a ride with multiple seats
exports.bookRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const userId = req.user.id;
    const { seatsToBook = 1 } = req.body; // Default to 1 seat if not specified

    // Validate seats to book
    if (!seatsToBook || seatsToBook < 1 || seatsToBook > 10) {
      return res.status(400).json({ message: "Invalid number of seats. Must be between 1 and 10." });
    }

    // Use atomic update to avoid triggering full-document validation
    const existing = await Ride.findById(rideId).select('driver seatsAvailable passengers');
    if (!existing) return res.status(404).json({ message: "Ride not found" });

    // Prevent driver from booking their own ride
    if (existing.driver.toString() === userId) {
      return res.status(400).json({ message: "You cannot book your own ride" });
    }

    if (existing.seatsAvailable < seatsToBook) {
      return res.status(400).json({ 
        message: `Not enough seats available. Only ${existing.seatsAvailable} seats remaining.` 
      });
    }

    // Check if user is already a passenger
    if (Array.isArray(existing.passengers) && existing.passengers.some(p => p.toString() === userId)) {
      return res.status(400).json({ message: "You have already booked this ride" });
    }

    // Create passenger entries for multiple seats
    const passengerEntries = Array(seatsToBook).fill(userId);

    // Perform atomic update: push passenger(s) and decrement seats
    const updated = await Ride.findByIdAndUpdate(
      rideId,
      {
        $push: { passengers: { $each: passengerEntries } },
        $inc: { seatsAvailable: -seatsToBook }
      },
      { new: true }
    ).populate('driver', 'name email phone')
     .populate('passengers', 'name email phone');

    res.json({ 
      message: `Successfully booked ${seatsToBook} seat(s)`, 
      seatsBooked: seatsToBook,
      ride: updated 
    });
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
