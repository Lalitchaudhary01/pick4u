// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const DriverDashboard = () => {
//   const navigate = useNavigate();
//   const [driverData, setDriverData] = useState(null);
//   const [message, setMessage] = useState("");

//   // JWT + Role check
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");
//     if (!token || role !== "driver") {
//       navigate("/auth/login");
//       return;
//     }

//     // Fetch driver info from backend
//     const fetchDriverData = async () => {
//       try {
//         const res = await axios.get("/api/driver/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDriverData(res.data);
//       } catch (err) {
//         setMessage(err.response?.data?.message || "Error fetching driver data");
//       }
//     };

//     fetchDriverData();
//   }, [navigate]);

//   if (!driverData) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>Driver Dashboard</h2>
//       <p>Name: {driverData.name}</p>
//       <p>Email: {driverData.email}</p>
//       <p>Phone: {driverData.phone}</p>
//       <p>KYC Status: {driverData.driverDetails.kycStatus}</p>
//       <p>Total Earnings: ₹{driverData.driverDetails.earnings}</p>

//       {/* Optional: Button to go to KYC Upload */}
//       {driverData.driverDetails.kycStatus === "pending" && (
//         <button onClick={() => navigate("/driver/kyc-upload")}>
//           Upload KYC Documents
//         </button>
//       )}

//       {/* Optional: Orders / History */}
//       <h3>Recent Orders</h3>
//       {driverData.orders && driverData.orders.length > 0 ? (
//         <ul>
//           {driverData.orders.map((order) => (
//             <li key={order._id}>
//               {order.customerName} - {order.status} - ₹{order.amount}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No orders yet.</p>
//       )}

//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default DriverDashboard;
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Call backend logout API
      await axios.post(
        "/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Redirect to login
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
      // Even if API fails, clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/auth/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default DriverDashboard;
