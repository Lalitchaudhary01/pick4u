import React, { useEffect, useState } from "react";
import { getCustomerProfile } from "../../api"; // customer.js exports via index.js

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getCustomerProfile(); // axios request
        setUser(res.data); // axios response data
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {user.phone}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {user.role}
        </p>
      </div>
    </div>
  );
}
