import api from './axios';

export const rideService = {
  // Create a new ride
  async createRide(rideData) {
    try {
      const response = await api.post('/rides', {
        origin: rideData.origin,
        destination: rideData.destination,
        date: rideData.date,
        time: rideData.time,
        seatsAvailable: rideData.seatsAvailable,
        price: rideData.price,
        description: rideData.description
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create ride' };
    }
  },

  // Get all rides
  async getAllRides() {
    try {
      const response = await api.get('/rides');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch rides' };
    }
  },

  // Get ride by ID
  async getRideById(rideId) {
    try {
      const response = await api.get(`/rides/${rideId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch ride details' };
    }
  },

  // Search rides
  async searchRides(origin, destination) {
    try {
      const response = await api.get('/rides/search', {
        params: { origin, destination }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to search rides' };
    }
  },

  // Get rides where user is driver
  async getDriverRides(userId) {
    try {
      const response = await api.get(`/rides/driver/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch driver rides' };
    }
  },

  // Get rides where user is passenger
  async getPassengerRides(userId) {
    try {
      const response = await api.get(`/rides/passenger/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch passenger rides' };
    }
  },

  // Get rides where user can give reviews
  async getReviewableRides(userId) {
    try {
      const response = await api.get(`/rides/user/${userId}/reviewable`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch reviewable rides' };
    }
  },

  // Book a ride
  async bookRide(rideId) {
    try {
      const response = await api.post(`/rides/${rideId}/book`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to book ride' };
    }
  },

  // Cancel a ride
  async cancelRide(rideId) {
    try {
      const response = await api.put(`/rides/${rideId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to cancel ride' };
    }
  }
};
