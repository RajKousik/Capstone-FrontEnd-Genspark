import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ArtistProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/artist/login" state={{ from: location }} replace />;
  }

  // If the user has the correct role, render the child component
  return children;
};

export default ArtistProtectedRoute;
