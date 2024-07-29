import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Convert user role to lowercase
  const userRole = user?.role.toLowerCase();

  // Check if the user's role is allowed for this route
  if (roles && !roles.map((role) => role.toLowerCase()).includes(userRole)) {
    // Determine the default redirection link based on user role
    let navigationLink = "user-dashboard"; // Default for unknown roles
    switch (userRole) {
      case "admin":
        navigationLink = "admin-dashboard";
        break;
      case "artist":
        navigationLink = "artist-dashboard";
        break;
      case "user":
        // user is already the default
        break;
    }
    // Redirect to the user's default dashboard
    return <Navigate to={`/${navigationLink}`} replace />;
  }

  // If the user has the correct role, render the child component
  return children;
};

export default ProtectedRoute;
