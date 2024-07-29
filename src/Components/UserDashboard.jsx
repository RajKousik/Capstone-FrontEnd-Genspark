import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MusicPlayer from "./MusicPlayerComponent";
import LeftNavbar from "./LeftNavbar";
import NavbarComponent from "./NavbarComponent";
// import Profile from "./Profile"; // Replace with actual component
// import Songs from "./Songs"; // Replace with actual component
// import MyPlaylist from "./MyPlaylist"; // Replace with actual component
// import PublicPlaylist from "./PublicPlaylist"; // Replace with actual component
// import Artists from "./Artists"; // Replace with actual component
// import ChangePassword from "./ChangePassword"; // Replace with actual component
// import UpgradePremium from "./UpgradePremium"; // Replace with actual component
import "../css/UserDashboard.css";
import LoginComponent from "./LoginComponent";
import SongsComponent from "./SongsComponent";

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <NavbarComponent />
      <div className="content">
        <Routes>
          {/* <Route path="/profile" element={<Profile />} /> */}
          {/* <Route path="/songs" element={<Songs />} />
            <Route path="/my-playlist" element={<MyPlaylist />} />
            <Route path="/public-playlist" element={<PublicPlaylist />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/upgrade-premium" element={<UpgradePremium />} /> */}
          {/* Default route or 404 page */}
          {/* <Route path="/profile" element={<NavbarComponent />} /> */}
          <Route path="/songs" element={<SongsComponent />} />
          {/* <Route path="/" element={<MusicPlayer />} /> */}
        </Routes>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default UserDashboard;
