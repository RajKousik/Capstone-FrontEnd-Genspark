import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RegisterComponent from "./Components/RegisterComponent";
import LoginComponent from "./Components/LoginComponent";
import VerificationComponent from "./Components/VerificationComponent";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./Components/AdminDashboard";
import UserDashboard from "./Components/UserDashboard";
import ArtistDashboard from "./Components/ArtistDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated, user } = useAuth();

  var navigationLink = "login";
  if (user?.role?.toLowerCase() === "admin") {
    navigationLink = "/admin-dashboard";
  } else if (user?.role?.toLowerCase() === "artist") {
    navigationLink = "/artist-dashboard";
  } else if (
    user?.role?.toLowerCase() === "premiumuser" ||
    user?.role?.toLowerCase() === "normaluser"
  ) {
    navigationLink = "/user-dashboard";
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginComponent />
          ) : (
            <Navigate to={`${navigationLink}`} />
          )
        }
      />
      <Route path="/register" element={<RegisterComponent />} />
      <Route path="/verify-code" element={<VerificationComponent />} />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute roles={["premiumuser", "normaluser"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist-dashboard"
        element={
          <ProtectedRoute roles={["artist"]}>
            <ArtistDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
