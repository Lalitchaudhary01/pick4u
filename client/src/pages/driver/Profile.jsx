import React, { useEffect, useState } from "react";
import { getDriverProfile } from "../../api/driverApi";

const DriverProfile = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getDriverProfile(token);
        setDriver(res.data);
      } catch (err) {
        console.error("Error fetching driver profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <p className="text-center">Loading profile...</p>;

  if (!driver)
    return <p className="text-center text-red-600">Profile not found</p>;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Driver Profile</h2>
      <p>
        <b>Name:</b> {driver.name}
      </p>
      <p>
        <b>Email:</b> {driver.email}
      </p>
      <p>
        <b>Phone:</b> {driver.phone}
      </p>
      <p>
        <b>Status:</b> {driver.kycStatus || "Pending"}
      </p>
    </div>
  );
};

export default DriverProfile;
