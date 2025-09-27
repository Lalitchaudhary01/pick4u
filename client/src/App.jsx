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
import Unauthorized from "./components/Unauthorized";
import DriverProfile from "./pages/driver/Profile";
import Earnings from "./pages/driver/Earnings";
import Dashboard from "./pages/driver/Dashboard";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import Users from "./pages/admin/User";
import Drivers from "./pages/admin/Driver";
import Orders from "./pages/admin/Order";
import Reports from "./pages/admin/Reports";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEarnings from "./pages/admin/AdminEarnings";
import DriverDashboard from "./pages/driver/Dashboard";
import OrderTracker from "./pages/customer/TrackOrder";

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

          <Route path="/customer/book" element={<BookDelivery />} />
          <Route path="/customer/track" element={<OrderTracker />} />
          <Route path="/customer/orders" element={<OrderHistory />} />
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/customer/payments" element={<Payments />} />
          <Route path="/customer/orders/:id" element={<OrderDetail />} />

          {/* ================= DRIVER ROUTES ================= */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute role="driver">
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
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
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/drivers" element={<Drivers />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/earnings" element={<AdminEarnings />} />
            <Route path="/admin/reports" element={<Reports />} />
          </Route>

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
