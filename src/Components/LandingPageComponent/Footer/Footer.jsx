import React from "react";
import "./Footer.css"; // Import the custom CSS file
import {
  FaYoutube,
  FaInstagramSquare,
  FaSnapchatGhost,
  FaTwitter,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer d-flex flex-column align-items-center justify-content-between px-5 bg-dark h-450 pt-180 mt-negative-100 position-relative">
      {/* Social icons */}
      <div>
        <div
          className="d-flex w-100 justify-content-between mt-14"
          style={{ width: "100%" }}
        >
          <div className="social-icon">
            <FaInstagramSquare style={{ color: "white", fontSize: "30px" }} />
          </div>
          <div className="social-icon">
            <FaYoutube style={{ color: "white", fontSize: "30px" }} />
          </div>
          <div className="social-icon">
            <FaTwitter style={{ color: "white", fontSize: "30px" }} />
          </div>
          <div className="social-icon">
            <FaSnapchatGhost style={{ color: "white", fontSize: "30px" }} />
          </div>
        </div>
        <div className="text-white px-15 text-center mt-4">
          Vibe with Us on Social Media!
          <br />
          <Link
            to="/artist/register"
            style={{ color: "#ffa500", textDecoration: "none" }}
          >
            Register yourself as an Artist <FaHeart />
          </Link>
        </div>
      </div>
      <div className="bottom-0 pb-2 text-white">
        Copyright <span style={{ color: "#ffa500" }}>@Vibe Vault</span> 2024
      </div>
    </div>
  );
}

export default Footer;
