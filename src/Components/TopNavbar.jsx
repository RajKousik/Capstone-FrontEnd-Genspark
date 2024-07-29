import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import "../css/TopNavbar.css";

const TopNavbar = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="top-navbar">
      <Navbar.Brand href="#home" className="app-name">
        Vibe - Vault
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Item className="profile-item">
          <FaUserCircle className="profile-icon" />
          <span className="profile-name">User Name</span>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default TopNavbar;
