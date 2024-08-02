import React, { useContext, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../NavbarComponent/NavbarComponent";
import ManageArtistSong from "../ManageArtistSong/ManageArtistSong";
import ManageAlbumComponent from "../ManageAlbumComponent/ManageAlbumComponent";
import ArtistProfileComponent from "../ArtistProfileComponent/ArtistProfileComponent";

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
        {activeLink === "artist-profile" && (
          <ArtistProfileComponent
            activeLink={activeLink}
            setActiveComponent={setActiveLink}
          />
        )}
        {activeLink === "manage-artist-songs" && <ManageArtistSong />}
        {activeLink === "manage-artist-albums" && <ManageAlbumComponent />}
      </div>
    </div>
  );
};

export default ArtistDashboard;
