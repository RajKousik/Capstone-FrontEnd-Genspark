// src/App.jsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RegisterComponent from "./Components/RegisterComponent";
import LoginComponent from "./Components/LoginComponent";
import VerificationComponent from "./Components/VerificationComponent"; // Import the VerificationComponent
import ProtectedRoute from "./ProtectedRoute";
import DashboardComponent from "./Components/DashboardComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !isAuthenticated ? <LoginComponent /> : <Navigate to="/dashboard" />
        }
      />
      <Route path="/register" element={<RegisterComponent />} />
      <Route
        path="/verify-code"
        element={<VerificationComponent />} // Add the route for VerificationComponent
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardComponent />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
