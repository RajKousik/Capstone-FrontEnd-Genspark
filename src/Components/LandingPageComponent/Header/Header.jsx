import React from "react";
import "./../LandingPageComponent.css"; // Import custom CSS for additional styles
import Logo from "../../../assets/logo/logo_no_background.png"; // Import custom CSS for additional styles
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export function Header() {
  return (
    <>
      <header className="header d-flex justify-content-between align-items-center px-5 py-3 bg-dark text-light">
        {/* Logo */}
        <img
          src={Logo}
          alt="Logo"
          className="landing-logo"
          style={{ cursor: "pointer" }}
        />
        <div className="buttons d-flex">
          <Button
            className="btn me-3"
            style={{ backgroundColor: "#212429", border: "1px solid #ffa500" }}
          >
            <Link
              to="/register"
              style={{
                color: "white",
                textDecoration: "none",
                backgroundColor: "#212429",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#ffa500")}
              onMouseLeave={(e) => (e.target.style.color = "white")}
            >
              Sign Up
            </Link>
          </Button>
          <Button
            className="btn"
            style={{
              backgroundColor: "#ffa500",
              color: "white",
              border: "1px solid #ffa500",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#212429")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffa500")}
          >
            <Link
              to="/login"
              style={{
                color: "inherit",
                textDecoration: "none",
                backgroundColor: "inherit",
              }}
              onMouseEnter={(e) => (
                (e.target.style.backgroundColor = "inherit"),
                (e.target.style.color = "#inherit")
              )}
              onMouseLeave={(e) => (
                (e.target.style.backgroundColor = "inherit"),
                (e.target.style.color = "#inherit")
              )}
            >
              Login
            </Link>
          </Button>
        </div>
      </header>
    </>
  );
}
