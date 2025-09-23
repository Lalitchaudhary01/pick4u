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
import Dashboard from "./pages/driver/Dashboard";
import KYCUpload from "./pages/driver/KYCUpload";
// import Earnings from "./pages/driver/Earnings";

// Public Website
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
// import BookDelivery from "./pages/public/BookDelivery";
import TrackOrder from "./pages/public/TrackOrder";
import Pricing from "./pages/public/Pricing";
import UserDashboard from "./pages/customer/UserDashboard";
import Orders from "./pages/customer/Orders";
import OrderDetail from "./pages/customer/OrderDetail";
import Profile from "./pages/customer/Profile";
import BookDelivery from "./pages/customer/BookDelivery";
// import DriverLogin from "./pages/public/DriverLogin";

function App() {
  return (
    <Router>
      {/* Navbar always visible */}
      <Navbar />

      <main>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookDelivery />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/pricing" element={<Pricing />} />

          {/* Auth */}
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/login" element={<Login />} />
          {/* //custoemr pages */}
          <Route path="/book" element={<BookDelivery />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />

          {/* Driver */}
          <Route path="/driver/dashboard" element={<Dashboard />} />
          <Route path="/driver/kyc-upload" element={<KYCUpload />} />
          {/* <Route path="/driver/earnings" element={<Earnings />} /> */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
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
