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

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/login" />} />

        {/* Public Auth Routes */}
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />
        <Route path="/auth/login" element={<Login />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
