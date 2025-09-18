import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Footer from '../components/Footer';
import { ArrowLeft } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Auto-attempt booking when this page loads unless owner flag is present.
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const isOwner = location?.state?.own === true;
    if (isOwner) {
      // Skip POST and show owner message client-side
      setLoading(false);
      setError('You cannot book your own ride');
      return;
    }

    const doBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.post(`/rides/${id}/book`);
        setBooking(res.data);
      } catch (err) {
        console.error('Booking failed:', err);
        const msg = err?.response?.data?.message || err?.message || 'Failed to book ride.';
        setError(msg);
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    doBooking();
  }, [id, isAuthenticated, navigate, location]);

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
          <h1 className="text-3xl md:text-4xl font-bold text-white">Booking Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Processing your booking...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Failed</h2>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="px-6 py-3 bg-gray-200 rounded-lg"
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Successful</h2>
                  <p className="text-gray-600 mb-6">Your seat has been reserved.</p>

                  <div className="grid grid-cols-1 gap-4 max-w-xl mx-auto text-left">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">Ride</p>
                      <p className="font-semibold text-gray-800">{booking?.ride?.origin} → {booking?.ride?.destination}</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-semibold text-gray-800">{new Date(booking?.ride?.date).toLocaleString()}</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">Driver</p>
                      <p className="font-semibold text-gray-800">{booking?.ride?.driver?.name || booking?.ride?.driver}</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-gray-500">Seat Price</p>
                      <p className="font-semibold text-gray-800">₹{booking?.ride?.price}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => navigate(-1)}
                      className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
 