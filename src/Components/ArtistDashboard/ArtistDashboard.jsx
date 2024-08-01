import React, { useContext, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../NavbarComponent/NavbarComponent";
import ManageArtistSong from "../ManageArtistSong/ManageArtistSong";

const ArtistDashboard = ({ activeLink, setActiveLink }) => {
  const { user } = useAuth();
  useEffect(() => {
    setActiveLink("artist-profile");
  }, []);
  return (
    <div className="user-dashboard">
      <NavbarComponent
        userRole={"artist"}
        activeLink={activeLink}
        setActiveComponent={setActiveLink}
      />
      <div className="content">
        {activeLink === "artist-profile" && <h1>Hello Artist</h1>}
        {activeLink === "manage-artist-songs" && <ManageArtistSong />}
      </div>
    </div>
  );
};

export default ArtistDashboard;
