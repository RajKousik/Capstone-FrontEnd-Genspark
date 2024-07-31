import React, { useEffect, useState } from "react";
import NavbarComponent from "../NavbarComponent/NavbarComponent";
import "./AdminDashboard.css";
import { useAuth } from "../../contexts/AuthContext";
import ProfileComponent from "../ProfileComponent/ProfileComponent";
import { DiJavascript1 } from "react-icons/di";
import ManageUsersComponent from "../ManageUsersComponent/ManageUsersComponent";
import ManageArtistsComponent from "../ManageArtistComponent/ManageArtistComponent";
import ManageSongsComponent from "../ManageSongsComponent/ManageSongsComponent";
import ManagePlaylistsComponent from "../ManagePlaylistsComponent/ManagePlaylistsComponent";

const AdminDashboard = ({ activeLink, setActiveLink }) => {
  const { user } = useAuth();
  useEffect(() => {
    setActiveLink("manage-users");
  }, []);
  return (
    <div className="user-dashboard">
      <NavbarComponent
        userRole={"admin"}
        activeLink={activeLink}
        setActiveComponent={setActiveLink}
      />
      <div className="content">
        {activeLink === "admin-profile" && (
          // <NavbarComponent

          // />
          <h1>Hello</h1>
        )}
        {activeLink === "manage-users" && <ManageUsersComponent />}
        {activeLink === "manage-artists" && <ManageArtistsComponent />}
        {activeLink === "manage-songs" && <ManageSongsComponent />}
        {activeLink === "manage-playlists" && <ManagePlaylistsComponent />}
      </div>
    </div>
  );
};

export default AdminDashboard;
