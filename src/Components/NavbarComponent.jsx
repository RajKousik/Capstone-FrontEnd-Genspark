import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import LogoWithNoBackground from "../assets/logo/logo_no_background.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/NavbarComponent.css"; // Custom styles for additional styling
import { useAuth } from "../contexts/AuthContext";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(
    location.pathname.split("/")[2] || "profile"
  );

  const { user } = useAuth();

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
        <img
          src={LogoWithNoBackground}
          alt="Logo"
          className="logo"
          style={{ marginRight: "10px", maxHeight: "40px" }}
        />
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
            {/* <FaUserCircle className="user-icon" /> */}
            <div className="user-avatar">
              <img
                src="https://res.cloudinary.com/deqk5oxse/image/upload/v1721715723/samples/smile.jpg"
                alt="User Avatar"
                className="rounded-circle"
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />
            </div>
            <span className="user-name">{user?.username || "User"}</span>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
