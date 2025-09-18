import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, MapPin, Calendar, Users, TrendingUp, ArrowRight, Car, Shield, Zap } from "lucide-react";
import axios from "../api/axios";
import Footer from "../components/Footer";


const Home = () => {
  const [popularRides, setPopularRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularRides();
  }, []);

  const fetchPopularRides = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/rides");
      // Get the most recent 6 rides as popular rides
      const recentRides = response.data.slice(0, 6);
      setPopularRides(recentRides);
      setError(null);
    } catch (err) {
      console.error("Error fetching rides:", err);
      setError("Failed to load popular rides from database");
      setPopularRides([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your pick of rides at{" "}
            <span className="bg-gradient-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
              low prices
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Start Carpooling to Save Money and the Environment. Share Empty Seats. 
            Save Money. Make Friends. Reduce CO2.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/search-ride" className="bg-white text-primary-700 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search Rides</span>
            </Link>
            <Link to="/create-ride" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-primary-700 transition-all duration-300 flex items-center space-x-2">
              <Car className="w-5 h-5" />
              <span>Create Ride</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Rides Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {loading ? "Loading Popular Rides..." : "Most Popular Routes"}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover the most traveled routes and join thousands of happy carpoolers
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-gray-600 mb-8">
              {error}
            </div>
          ) : popularRides.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No rides available</h3>
                <p className="text-gray-600">Be the first to create a ride and start carpooling!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {popularRides.map((ride) => (
                <div
                  key={ride._id}
                  className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-bold text-primary-700 text-sm mb-2">
                      {ride.origin} → {ride.destination}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {formatDate(ride.date)}
                    </div>
                    <div className="text-xs text-primary-600">
                      <Users className="w-3 h-3 inline mr-1" />
                      ₹{ride.price} • {ride.seatsAvailable} seats
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/search-ride"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>Explore All Rides</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose CarPoolMate?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the future of travel with our innovative features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Best Prices</h3>
              <p className="text-gray-600 leading-relaxed">
                Find the perfect ride by bus or carpool to a wide range of destinations at the lowest prices available.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Trust & Safety</h3>
              <p className="text-gray-600 leading-relaxed">
                Profiles, reviews, and ID checks help ensure you're traveling safely with verified members.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Easy Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Booking has never been easier. Use our app or website and book your ride in minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Functionality Section */}
      <div className="py-20 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Be Both Driver & Passenger
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              CarPoolMate gives you the flexibility to create rides when you're driving and book rides when you need a lift. 
              Switch between roles seamlessly and make the most of every journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Driver Functionality */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Create & Share Rides</h3>
                <p className="text-gray-600">Turn your daily commute into extra income</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Set Your Route</h4>
                    <p className="text-gray-600 text-sm">Choose origin, destination, date, and time</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Set Your Price</h4>
                    <p className="text-gray-600 text-sm">Decide how much to charge per seat</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Get Booked</h4>
                    <p className="text-gray-600 text-sm">Passengers find and book your ride</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/create-ride"
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Start Creating Rides
                </Link>
              </div>
            </div>

            {/* Passenger Functionality */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Find & Book Rides</h3>
                <p className="text-gray-600">Travel affordably with verified drivers</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Search Available Rides</h4>
                    <p className="text-gray-600 text-sm">Browse rides by route, date, and price</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-accent-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Check Driver Details</h4>
                    <p className="text-gray-600 text-sm">View ratings, reviews, and vehicle info</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Book & Travel</h4>
                    <p className="text-gray-600 text-sm">Secure your seat and enjoy the journey</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/search-ride"
                  className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Find Available Rides
                </Link>
              </div>
            </div>
          </div>

          {/* Benefits Summary */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Why This Dual Approach Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 text-xl">💰</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Save Money</h4>
                <p className="text-gray-600 text-sm">Earn when driving, save when traveling</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-success-600 text-xl">🌱</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Eco-Friendly</h4>
                <p className="text-gray-600 text-sm">Reduce carbon footprint together</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-600 text-xl">🤝</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Community</h4>
                <p className="text-gray-600 text-sm">Build connections through travel</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
