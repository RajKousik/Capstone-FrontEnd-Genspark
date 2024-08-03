import React from "react";
import "./LandingPageComponent.css"; // Import custom CSS for additional styles
import Logo from "../../assets/logo/logo_no_background.png"; // Import custom CSS for additional styles
import LandingPageBody from "./Body/LandingPageBody";
import Footer from "./Footer/Footer";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Header } from "./Header/Header";

export function LandingPageComponent() {
  return (
    <div>
      <Header />
      <LandingPageBody />
      <Footer />
    </div>
  );
}
