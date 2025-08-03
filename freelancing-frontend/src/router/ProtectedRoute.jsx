import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (role) {
    // Handle both single role and array of roles
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user?.role)) {
      return <Navigate to="/" />;
    }
  }
  
  return children;
};

export default ProtectedRoute;