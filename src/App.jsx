import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RegisterComponent from "./Components/RegisterComponent/RegisterComponent";
import LoginComponent from "./Components/LoginComponent/LoginComponent";
import VerificationComponent from "./Components/VerificationComponent/VerificationComponent";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import ArtistDashboard from "./Components/ArtistDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./contexts/AuthContext";
import { MusicProvider } from "./contexts/MusicContext";

function App() {
  const { isAuthenticated, user } = useAuth();

  const [activeLink, setActiveLink] = useState("songs"); // Default active link

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
            <AdminDashboard
              activeLink={activeLink}
              setActiveLink={setActiveLink}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard/*"
        element={
          <ProtectedRoute roles={["premiumuser", "normaluser"]}>
            <MusicProvider>
              <UserDashboard
                activeLink={activeLink}
                setActiveLink={setActiveLink}
              />
            </MusicProvider>
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
