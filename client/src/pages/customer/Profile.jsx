import React, { useEffect, useState } from "react";
import { getCustomerProfile } from "../../api"; // API call

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getCustomerProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#0500FF] to-[#16C9FF] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
            {user.name?.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.role?.toUpperCase()}</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-lg">📧</span>
            <span className="text-gray-700 font-medium">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-lg">📱</span>
            <span className="text-gray-700 font-medium">{user.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-lg">📝</span>
            <span className="text-gray-700 font-medium">Role: {user.role}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-lg">📅</span>
            <span className="text-gray-700 font-medium">
              Member Since: {user.memberSince || "N/A"}
            </span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => alert("Edit Profile clicked")} // replace with navigation
          className="mt-6 w-full bg-[#0500FF] text-white py-2 rounded-lg font-semibold hover:bg-[#0400cc] transition-all"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
