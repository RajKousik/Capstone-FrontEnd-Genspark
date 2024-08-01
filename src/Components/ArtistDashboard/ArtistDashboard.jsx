import React, { useContext } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const ArtistDashboard = () => {
  const { user, token, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await axiosInstance.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    logout();
    navigate("/artist/login");
  };
  return (
    <>
      <div>Artist Dashboard</div>
      <Button onClick={handleLogout}>Logout</Button>
    </>
  );
};

export default ArtistDashboard;
