import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/NavbarComponent.css"; // Custom styles for additional styling

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(
    location.pathname.split("/")[2] || "profile"
  );

  const handleNavigation = (path) => {
    setActiveLink(path.split("/")[1]);
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="hamburger-icon"
        >
          <FaBars />
        </Navbar.Toggle>
        <Navbar.Brand className="app-name">Vibe - Vault</Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto nav-links">
            <Nav.Link
              href="/user-dashboard/profile"
              onClick={() => handleNavigation("/profile")}
              className={activeLink === "profile" ? "active" : ""}
            >
              Profile
            </Nav.Link>
            <Nav.Link
              href="/user-dashboard/songs"
              onClick={() => handleNavigation("/songs")}
              className={activeLink === "songs" ? "active" : ""}
            >
              Songs
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("/my-playlist")}
              className={activeLink === "my-playlist" ? "active" : ""}
            >
              My Playlist
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("/public-playlist")}
              className={activeLink === "public-playlist" ? "active" : ""}
            >
              Public Playlist
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("/artists")}
              className={activeLink === "artists" ? "active" : ""}
            >
              Artists
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("/change-password")}
              className={activeLink === "change-password" ? "active" : ""}
            >
              Change Password
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavigation("/upgrade-premium")}
              className={activeLink === "upgrade-premium" ? "active" : ""}
            >
              Upgrade Premium
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav className="ms-auto">
          <Nav.Item className="user-info">
            <FaUserCircle className="user-icon" />
            <span className="user-name">User Name</span>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
