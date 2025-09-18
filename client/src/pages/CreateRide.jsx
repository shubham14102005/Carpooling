import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, MapPin, Calendar, Clock, Users, DollarSign, ArrowLeft } from "lucide-react";
import axios from "../api/axios";
import Footer from "../components/Footer";

const CreateRide = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    seatsAvailable: 1,
    price: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Please log in to create a ride");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const rideData = {
        ...formData,
        driver: user.id,
        status: "active"
      };

      const response = await axios.post("/rides", rideData);
      
      alert("Ride created successfully!");
      navigate("/search-ride");
    } catch (error) {
      console.error("Error creating ride:", error);
      setError(error.response?.data?.message || "Failed to create ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to create a ride</h2>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center text-white">
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Create a{" "}
            <span className="bg-gradient-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
              New Ride
            </span>
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Share your journey and help others travel affordably while earning extra income
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ride Details</h2>
              
              {error && (
                <div className="mb-6 bg-error-50 border border-error-200 rounded-lg p-4">
                  <p className="text-error-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Origin and Destination */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter origin city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter destination city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Seats and Price */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Available Seats
                    </label>
                    <select
                      name="seatsAvailable"
                      value={formData.seatsAvailable}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} seat{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Price per Seat (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="Enter price per seat"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Add any additional details about your ride..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Ride...
                    </div>
                  ) : (
                    'Create Ride'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Driver Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Driver Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'D'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user?.name || 'Driver'}</p>
                    <p className="text-sm text-gray-600">{user?.email || 'driver@example.com'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Tips for Success</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Set a competitive price to attract passengers</li>
                <li>• Be punctual and communicate clearly</li>
                <li>• Keep your vehicle clean and well-maintained</li>
                <li>• Be friendly and professional</li>
                <li>• Follow safety guidelines</li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-2xl p-6 border border-accent-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🚗 Benefits of Carpooling</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Earn extra income</li>
                <li>• Reduce travel costs</li>
                <li>• Help the environment</li>
                <li>• Meet new people</li>
                <li>• Reduce traffic congestion</li>
              </ul>
            </div>
          </div>
        </div>


      </div>

      <Footer />
    </div>
  );
};

export default CreateRide;
