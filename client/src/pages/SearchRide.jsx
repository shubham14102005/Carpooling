import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, DollarSign, Star, Filter, Car, Clock, Eye } from "lucide-react";
import axios from "../api/axios";
import Footer from "../components/Footer";

const SearchRide = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    fetchRides();
  }, []);

  useEffect(() => {
    filterRides();
  }, [rides, searchTerm, selectedDate, priceRange]);

  const fetchRides = async () => {
    try {
  // fetching rides
      setLoading(true);
      const response = await axios.get("/rides");
      setRides(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching rides:", error);
      setError("Failed to load rides from database. Please try again.");
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRides = () => {
    let filtered = rides;

    // Filter by search term (origin or destination)
    if (searchTerm) {
      filtered = filtered.filter(ride =>
        ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(ride => ride.date === selectedDate);
    }

    // Filter by price range
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter(ride => {
        if (max) {
          return ride.price >= min && ride.price <= max;
        } else {
          return ride.price >= min;
        }
      });
    }
    
    setFilteredRides(filtered);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleViewDetails = (rideId) => {
    navigate(`/ride-details/${rideId}`);
  };

  // render

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Search{" "}
            <span className="bg-gradient-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
              Rides
            </span>
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Find the perfect carpool ride from our community of drivers
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by origin or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Price Range Filter */}
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="0-500">₹0 - ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-2000">₹1000 - ₹2000</option>
                <option value="2000-">₹2000+</option>
              </select>
            </div>
          </div>

          {/* Filter Results Count */}
          {filteredRides.length > 0 && (
            <div className="mt-4 flex items-center space-x-2 text-primary-600">
              <Filter className="w-4 h-4" />
              <span>Filtered Results</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-error-50 border border-error-200 rounded-lg p-6">
                <p className="text-error-700">{error}</p>
              </div>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No rides found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or check back later for new rides.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredRides.map((ride) => (
                <div key={ride._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      {/* Ride Details */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                            <Car className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {ride.origin} → {ride.destination}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(ride.date)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{ride.seatsAvailable} seats available</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Driver Info */}
                        {ride.driver && (
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-700 font-semibold text-sm">
                                  {ride.driver.name ? ride.driver.name.split(' ').map(n => n[0]).join('') : 'D'}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{ride.driver.name || 'Driver'}</p>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-accent-500 fill-current" />
                                  <span className="text-sm text-gray-600">4.5 (25 rides)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Price and Action */}
                      <div className="lg:text-right lg:ml-6">
                        <div className="mb-4">
                          <p className="text-3xl font-bold text-primary-600">₹{ride.price}</p>
                          <p className="text-sm text-gray-600">per seat</p>
                        </div>
                        <button
                          onClick={() => handleViewDetails(ride._id)}
                          disabled={ride.seatsAvailable === 0}
                          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                            ride.seatsAvailable === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:scale-105'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          <span>{ride.seatsAvailable === 0 ? 'No Seats' : 'View Details'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchRide;
