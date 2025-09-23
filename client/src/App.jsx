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
// import TrackOrder from "./pages/public/TrackOrder";
// import Pricing from "./pages/public/Pricing";
import BookDelivery from "./pages/customer/BookDelivery";
import TrackOrder from "./pages/customer/TrackOrder";
import OrderHistory from "./pages/customer/OrderHistory";
import Profile from "./pages/customer/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Payments from "./pages/customer/Payment";
import OrderDetail from "./pages/customer/OrderDetail";

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
          {/* <Route path="/book" element={<BookDelivery />} /> */}
          {/* <Route path="/track" element={<TrackOrder />} />
          <Route path="/pricing" element={<Pricing />} /> */}

          {/* Auth */}
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="/auth/login" element={<Login />} />
          {/* //custoemr pages */}
          {/* Protected Customer Routes */}
          <Route
            path="/customer/book"
            element={
              <ProtectedRoute>
                <BookDelivery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/track"
            element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          {/* Driver */}

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
