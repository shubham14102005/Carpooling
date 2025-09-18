import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, MapPin, Calendar, Clock, Users, DollarSign, Star, User, MessageSquare, ArrowLeft, Phone, Mail } from "lucide-react";
import axios from "../api/axios";
import Footer from "../components/Footer";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/rides/${id}`);
      setRide(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching ride details:", error);
      setError("Failed to load ride details from database");
      setRide(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async () => {
    if (!isAuthenticated) {
      alert("Please log in to book this ride");
      return;
    }
    
  // Check if already booked
    const isAlreadyBooked = ride?.passengers?.some(passenger => 
      passenger._id === user?.id || passenger === user?.id
    );
    if (isAlreadyBooked) {
      alert("You have already booked this ride.");
      return;
    }

    try {
      // navigate to booking page which will perform the POST and show result
      setBookingLoading(true);
      const isOwnRide = ride?.driver?._id === user?.id || ride?.driver === user?.id;
      if (isOwnRide) {
        navigate(`/book-details/${id}`, { state: { own: true } });
      } else {
        navigate(`/book-details/${id}`);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-accent-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ride Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The ride you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/search-ride")}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Search Other Rides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {ride.origin} → {ride.destination}
          </h1>
          <p className="text-primary-100 text-lg">
            {formatDate(ride.date)} at {formatTime(ride.time)}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ride Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ride Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">From</p>
                      <p className="font-semibold text-gray-800">{ride.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-secondary-600" />
                    <div>
                      <p className="text-sm text-gray-600">To</p>
                      <p className="font-semibold text-gray-800">{ride.destination}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-accent-600" />
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-semibold text-gray-800">{formatDate(ride.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-semibold text-gray-800">{formatTime(ride.time)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-secondary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Available Seats</p>
                      <p className="font-semibold text-gray-800">{ride.seatsAvailable} seats</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-accent-600" />
                    <div>
                      <p className="text-sm text-gray-600">Price per Seat</p>
                      <p className="font-semibold text-gray-800">₹{ride.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {ride.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">Additional Information</h3>
                  <p className="text-gray-700">{ride.description}</p>
                </div>
              )}
            </div>

            {/* Driver Information */}
            {ride.driver && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Driver Information</h2>
                
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                      {ride.driver.name ? ride.driver.name.split(' ').map(n => n[0]).join('') : 'D'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{ride.driver.name || 'Driver'}</h3>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(4.5)}
                        <span className="text-sm text-gray-600">(4.5)</span>
                      </div>
                      <span className="text-sm text-gray-600">• 25 rides completed</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{ride.driver.email || 'driver@example.com'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{ride.driver.phone || '+91 98765 43210'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Book This Ride</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per seat</span>
                  <span className="font-semibold text-gray-800">₹{ride.price}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available seats</span>
                  <span className="font-semibold text-gray-800">{ride.seatsAvailable}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-primary-600">₹{ride.price}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleBookRide}
                disabled={
                  bookingLoading ||
                  ride.seatsAvailable === 0 ||
                  !isAuthenticated
                }
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  bookingLoading || ride.seatsAvailable === 0 || !isAuthenticated
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105'
                }`}
              >
                {bookingLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Booking...
                  </div>
                ) : ride.seatsAvailable === 0 ? (
                  'No Seats Available'
                ) : !isAuthenticated ? (
                  'Login to Book'
                ) : (
                  'Book Now'
                )}
              </button>

            </div>

            {/* Safety Tips */}
            <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl p-6 border border-accent-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🛡️ Safety Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Meet in a public place</li>
                <li>• Share your location with friends</li>
                <li>• Verify driver details</li>
                <li>• Trust your instincts</li>
                <li>• Keep emergency contacts handy</li>
              </ul>
            </div>
          </div>
        </div>


      </div>

      <Footer />
    </div>
  );
};

export default RideDetails;
