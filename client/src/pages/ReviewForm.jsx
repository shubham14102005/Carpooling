import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Star, User, Car, Send, MessageSquare } from "lucide-react";
import axios from "../api/axios";
import { reviewService } from "../api/reviewService";
import Footer from "../components/Footer";

const ReviewForm = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    role: "driver"
  });
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReviews();
    }
  }, [isAuthenticated, user]);

  // Preload selected ride and role from navigation state (from MyRides)
  useEffect(() => {
    const state = location.state;
    if (state?.selectedRide) {
      const role = state.role === 'passenger' ? 'passenger' : 'driver';
      
      setReviewForm({
        rating: 5,
        comment: "",
        role: role
      });
    }
  }, [location.state]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
  // Fetch all reviews from all users
  const response = await axios.get(`/reviews/all`);
      setReviews(response.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (submitting) return;
      setSubmitting(true);
      
      const trimmed = reviewForm.comment.trim();
      if (!trimmed) {
        setCommentError("Review description is required");
        setSubmitting(false);
        return;
      }
      if (trimmed.length < 10) {
        setCommentError("Please write at least 10 characters");
        setSubmitting(false);
        return;
      }
      setCommentError("");
      
  // submitting review

      const reviewData = {
        rating: reviewForm.rating,
        comment: trimmed,
        role: reviewForm.role
      };

      const result = await reviewService.createReview(reviewData);
  // review created successfully
      
      alert("Review submitted successfully!");
      setReviewForm({ 
        rating: 5, 
        comment: "", 
        role: "driver"
      });
      setCommentError("");
      
  // Refresh reviews
      await fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      const message = error?.message || error?.error || "Failed to submit review. Please try again.";
      alert(message);
    } finally {
      setSubmitting(false);
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view reviews</h2>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 py-16 px-4 mb-8">
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Reviews &{" "}
              <span className="bg-gradient-to-r from-accent-300 to-accent-100 bg-clip-text text-transparent">
                Ratings
              </span>
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Share your experiences and read reviews from other carpoolers
            </p>
          </div>
        </div>

        {/* Review Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-primary-500" />
            <span>Submit a Review</span>
          </h2>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* User Name Display */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-primary-600 font-medium">Reviewing as:</p>
                  <p className="font-bold text-primary-800">{user?.name || "User"}</p>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Your Role</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  reviewForm.role === "driver" 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}>
                  <input
                    type="radio"
                    value="driver"
                    checked={reviewForm.role === "driver"}
                    onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reviewForm.role === "driver" ? 'bg-primary-500' : 'bg-gray-200'
                    }`}>
                      <Car className={`w-4 h-4 ${reviewForm.role === "driver" ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className={`font-medium ${reviewForm.role === "driver" ? 'text-primary-700' : 'text-gray-700'}`}>Driver</span>
                  </div>
                </label>
                <label className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  reviewForm.role === "passenger" 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}>
                  <input
                    type="radio"
                    value="passenger"
                    checked={reviewForm.role === "passenger"}
                    onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                    className="text-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reviewForm.role === "passenger" ? 'bg-primary-500' : 'bg-gray-200'
                    }`}>
                      <User className={`w-4 h-4 ${reviewForm.role === "passenger" ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className={`font-medium ${reviewForm.role === "passenger" ? 'text-primary-700' : 'text-gray-700'}`}>Passenger</span>
                  </div>
                </label>
              </div>
            </div>


            {/* Rating */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Rating</label>
              <div className="flex space-x-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                      star <= reviewForm.rating
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300 hover:shadow-md'
                    }`}
                  >
                    <Star className="w-7 h-7" />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 font-medium">{reviewForm.rating} out of 5 stars</p>
            </div>

            {/* Review Description */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Review Description</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Share your experience with this carpool..."
                required
              />
              <div className="flex justify-between text-sm">
                <span className={`${commentError ? 'text-red-500' : 'text-gray-500'}`}>
                  {commentError || 'Minimum 10 characters'}
                </span>
                <span className="text-gray-400">{reviewForm.comment.trim().length}/500</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                submitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </form>
        </div>

        {/* Reviews Display */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Star className="w-6 h-6 text-accent-500" />
            <span>Recent Reviews</span>
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Submit your first review above!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-gradient-to-r from-gray-50 to-primary-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        review.role === 'driver' ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gradient-to-r from-accent-500 to-orange-500'
                      }`}>
                        {review.role === 'driver' ? (
                          <Car className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">{review.reviewer?.name || "User"}</h3>
                        <p className="text-sm text-gray-600 font-medium capitalize">
                          {review.role === 'driver' ? 'Driver' : 'Passenger'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">{formatDate(review.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 font-medium">({review.rating}/5)</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-l-4 border-primary-500">
                    <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
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

export default ReviewForm;
