// NavbarLayout.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import SongsComponent from "./SongsComponent";
import PlaylistComponent from "./PlaylistComponent";

const NavbarLayout = () => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    likedSongs,
    setCurrentSong,
    songs, // Access songs from context
  } = useMusic();
  return (
    <div className="navbar-layout">
      <NavbarComponent />
      <div className="content">
        <Routes>
          <Route
            path="/songs"
            element={
              <SongsComponent
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                setIsPlaying={setIsPlaying}
                isPlaying={isPlaying}
                likedSongs={likedSongs}
                toggleLike={toggleLike}
                songs={songs}
              />
            }
          />
          <Route path="/playlists" element={<PlaylistComponent />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </div>
  );
};

export default NavbarLayout;
