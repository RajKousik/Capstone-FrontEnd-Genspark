import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import LogoWithNoBackground from "../assets/logo/logo_no_background.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/NavbarComponent.css"; // Custom styles for additional styling
import { useAuth } from "../contexts/AuthContext";

const NavbarComponent = ({ activeLink, setActiveComponent }) => {
  const { user } = useAuth();

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
              onClick={() => setActiveComponent("profile")}
              style={{
                color: activeLink === "profile" ? "#ffa500" : "inherit",
              }}
            >
              Profile
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveComponent("songs")}
              style={{ color: activeLink === "songs" ? "#ffa500" : "inherit" }}
            >
              Songs
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveComponent("playlists")}
              style={{
                color: activeLink === "playlists" ? "#ffa500" : "inherit",
              }}
            >
              Playlists
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveComponent("artists")}
              style={{
                color: activeLink === "artists" ? "#ffa500" : "inherit",
              }}
            >
              Artists
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveComponent("change-password")}
              style={{
                color: activeLink === "change-password" ? "#ffa500" : "inherit",
              }}
            >
              Change Password
            </Nav.Link>
            <Nav.Link
              onClick={() => setActiveComponent("explore-premium")}
              style={{
                color: activeLink === "explore-premium" ? "#ffa500" : "inherit",
              }}
            >
              Explore Premium
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Nav className="ms-auto">
          <Nav.Item className="user-info">
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
