import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Footer from '../components/Footer';
import { ArrowLeft, Users, MapPin, Calendar, Clock } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [ride, setRide] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const isOwner = location?.state?.own === true;
    if (isOwner) {
      setLoading(false);
      setError('You cannot book your own ride');
      return;
    }

    // Fetch ride details instead of auto-booking
    fetchRideDetails();
  }, [id, isAuthenticated, navigate, location]);

  const fetchRideDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/rides/${id}`);
      setRide(res.data);
    } catch (err) {
      console.error('Failed to fetch ride details:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to load ride details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      setBookingLoading(true);
      setError(null);
      const res = await axios.post(`/rides/${id}/book`, { seatsToBook });
      setBooking(res.data);
    } catch (err) {
      console.error('Booking failed:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to book ride.';
      setError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 py-16 px-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Book Your Ride</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading ride details...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Failed</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          ) : booking ? (
            <div className="text-center py-6">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Successful!</h2>
              <p className="text-gray-600 mb-6">
                {booking.message || `Successfully booked ${booking.seatsBooked} seat(s)`}
              </p>

              <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto text-left">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-semibold text-gray-800">{booking?.ride?.origin} → {booking?.ride?.destination}</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(booking?.ride?.date).toLocaleDateString()} at {booking?.ride?.time}
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Seats Booked</p>
                  <p className="font-semibold text-gray-800">{booking.seatsBooked} seat(s)</p>
                </div>

                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="font-semibold text-gray-800">₹{(booking?.ride?.price * booking.seatsBooked).toFixed(2)}</p>
                </div>
              </div>

              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={() => navigate('/search-ride')}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Search More Rides
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          ) : ride ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Booking</h2>
              
              {/* Ride Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-semibold">{ride.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-semibold">{ride.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{new Date(ride.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-semibold">{ride.time}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available Seats:</span>
                    <span className="font-semibold text-lg">{ride.seatsAvailable}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price per seat:</span>
                    <span className="font-semibold text-lg">₹{ride.price}</span>
                  </div>
                </div>
              </div>

              {/* Seat Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of seats to book:
                </label>
                <select
                  value={seatsToBook}
                  onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={bookingLoading}
                >
                  {Array.from({ length: Math.min(ride.seatsAvailable, 10) }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} seat{num > 1 ? 's' : ''} - ₹{(ride.price * num).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Cost */}
              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total Cost:</span>
                  <span className="text-2xl font-bold text-primary-600">₹{(ride.price * seatsToBook).toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookDetails;
 