import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ClientDashboard from "../pages/ClientDashboard";
import FreelancerDashboard from "../pages/FreelancerDashboard";
import FreelancerAwardedJobs from "../pages/FreelancerAwardedJobs";
import AdminPanel from "../pages/AdminPanel";
import Profile from "../components/Profile";
import ApiExample from "../components/ApiExample";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

// Dashboard component that redirects based on user role
const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  switch (user.role) {
    case 'Client':
      return <ClientDashboard />;
    case 'Freelancer':
      return <FreelancerDashboard />;
    case 'Admin':
      return <AdminPanel />;
    default:
      return <Navigate to="/" />;
  }
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/api-example"
      element={
        <ProtectedRoute>
          <ApiExample />
        </ProtectedRoute>
      }
    />
    <Route
      path="/client"
      element={
        <ProtectedRoute role={['Client', 'Admin']}>
          <ClientDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/freelancer"
      element={
        <ProtectedRoute role={['Freelancer', 'Admin']}>
          <FreelancerDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/freelancer/awarded"
      element={
        <ProtectedRoute role={['Freelancer', 'Admin']}>
          <FreelancerAwardedJobs />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute role="Admin">
          <AdminPanel />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;