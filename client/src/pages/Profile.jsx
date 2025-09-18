import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";
import axios from "../api/axios";
import Footer from "../components/Footer";

const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    dob: user?.dob ? new Date(user.dob).toISOString().slice(0,10) : ""
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        dob: user.dob ? new Date(user.dob).toISOString().slice(0,10) : ""
      });
    }
  }, [isAuthenticated, user]);

  const handleSave = async () => {
    try {
  setLoading(true);
  // prepare payload converting dob to ISO if present
  const payload = { ...editForm };
  if (payload.dob === "" || payload.dob === null) payload.dob = null;
  const response = await axios.put(`/auth/users/${user.id}`, payload);
      
      // Update the user context with the new data
      const updatedUser = response?.data?.user || { ...user, ...editForm };
      updateUser(updatedUser);
      
      // Update the form state to reflect the saved data
      setEditForm({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        dob: updatedUser.dob ? new Date(updatedUser.dob).toISOString().slice(0,10) : ""
      });
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      const msg = error?.response?.data?.error || error?.response?.data?.message || "Failed to update profile. Please try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      dob: user?.dob ? new Date(user.dob).toISOString().slice(0,10) : ""
    });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your profile</h2>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-secondary-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 py-16 px-4 mb-8 rounded-2xl">
          <div className="max-w-6xl mx-auto text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-6">
                <span className="text-3xl font-bold text-white">{getInitials(user?.name)}</span>
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{user?.name || "User"}</h1>
                <p className="text-xl text-primary-100">{user?.email}</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all mx-auto"
              >
                <Edit className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-green-500 transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-500/80 backdrop-blur-sm text-white rounded-xl hover:bg-red-500 transition-all"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <User className="w-6 h-6 text-primary-500" />
            <span>Profile Information</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-800">{user?.name || "Not provided"}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-800">{user?.email || "Not provided"}</span>
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-800">{user?.phone || "Not provided"}</span>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your address"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-800">{user?.address || "Not provided"}</span>
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={editForm.dob}
                  onChange={(e) => setEditForm({...editForm, dob: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-800">{user?.dob ? new Date(user.dob).toLocaleDateString() : "Not provided"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;
