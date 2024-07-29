import React from "react";
import { Navbar, Nav, NavDropdown, Button, Container } from "react-bootstrap";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import "../css/LeftNavbar.css";

const LeftNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

  return (
    <div className={`left-navbar ${isOpen ? "open" : ""}`}>
      <Navbar bg="dark" variant="dark" expand="lg" className="flex-column">
        <Navbar.Brand href="#home">
          <div className="navbar-toggle" onClick={toggleNavbar}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        </Navbar.Brand>
        <Navbar.Collapse>
          <Nav className="flex-column">
            <Nav.Link href="#profile">Profile</Nav.Link>
            <Nav.Link href="#songs">Songs</Nav.Link>
            <Nav.Link href="#my-playlist">My Playlist</Nav.Link>
            <Nav.Link href="#public-playlist">Public Playlist</Nav.Link>
            <Nav.Link href="#artists">Artists</Nav.Link>
            <Nav.Link href="#change-password">Change Password</Nav.Link>
            <Nav.Link href="#upgrade-premium">Upgrade Premium</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default LeftNavbar;
