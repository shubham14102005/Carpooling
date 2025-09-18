import api from './axios';

export const reviewService = {
  // Create a new review
  async createReview(reviewData) {
    try {
      const response = await api.post('/reviews', {
        rating: reviewData.rating,
        comment: reviewData.comment,
        role: reviewData.role
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create review' };
    }
  },

  // Get reviews for a ride
  async getReviewsByRide(rideId) {
    try {
      const response = await api.get(`/reviews/ride/${rideId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch reviews' };
    }
  },

  // Get reviews by user
  async getReviewsByUser() {
    try {
      const response = await api.get('/reviews/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user reviews' };
    }
  },

  // Get reviews where user is the driver
  async getDriverReviews(userId) {
    try {
      const response = await api.get(`/reviews/driver/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch driver reviews' };
    }
  },

  // Get reviews where user is the passenger
  async getPassengerReviews(userId) {
    try {
      const response = await api.get(`/reviews/passenger/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch passenger reviews' };
    }
  }
};
