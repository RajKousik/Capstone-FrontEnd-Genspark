import React, { useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { withCookies } from "react-cookie";

const DashboardComponent = () => {
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
    navigate("/login");
  };

  return (
    <div>
      {user ? <p>Welcome {user.email}</p> : null}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default DashboardComponent;
