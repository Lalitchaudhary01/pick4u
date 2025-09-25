import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import Login from "./pages/auth/Login";

// Driver Pages
import KYCUpload from "./pages/driver/KYCUpload";

// Public Website
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

import BookDelivery from "./pages/customer/BookDelivery";
import TrackOrder from "./pages/customer/TrackOrder";
import OrderHistory from "./pages/customer/OrderHistory";
import Profile from "./pages/customer/Profile";
import Payments from "./pages/customer/Payment";
import OrderDetail from "./pages/customer/OrderDetail";

import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized"; // new Unauthorized page
import DriverProfile from "./pages/driver/Profile";
import Earnings from "./pages/driver/Earnings";
import Dashboard from "./pages/driver/Dashboard";

function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      <main>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ================= CUSTOMER ROUTES ================= */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer/book" element={<BookDelivery />} />
            <Route path="/customer/track" element={<TrackOrder />} />
            <Route path="/customer/orders" element={<OrderHistory />} />
            <Route path="/customer/profile" element={<Profile />} />
            <Route path="/customer/payments" element={<Payments />} />
            <Route path="/customer/orders/:id" element={<OrderDetail />} />
          </Route>

          {/* ================= DRIVER ROUTES ================= */}
          {/* Driver Routes */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute role="driver">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route element={<ProtectedRoute role="driver" />}>
            {/* <Route path="/driver/orders" element={<h1>Orders</h1>} />
            <Route path="/driver/revenue" element={<h1>Revenue</h1>} />
            <Route path="/driver/profile" element={<h1>Profile</h1>} /> */}
          </Route>
          <Route
            path="/driver/profile"
            element={
              <ProtectedRoute role="driver">
                <DriverProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/kyc"
            element={
              <ProtectedRoute role="driver">
                <KYCUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/earnings"
            element={
              <ProtectedRoute role="driver">
                <Earnings />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
            <Route
              path="/admin/manage-orders"
              element={<h1>Manage Orders</h1>}
            />
            <Route
              path="/admin/manage-drivers"
              element={<h1>Manage Drivers</h1>}
            />
          </Route> */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer always visible */}
      <Footer />
    </Router>
  );
}

export default App;
