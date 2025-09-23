import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // not logged in → redirect to login
    return <Navigate to="auth/login" replace />;
  }

  return children;
}
