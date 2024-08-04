import React, { useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaClock,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import "./SongsComponent.css";
import { useMusic } from "../../contexts/MusicContext";

const SongsComponent = ({ setActiveLink, setSelectedSong }) => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    likedSongs,
    setCurrentSong,
    songs, // Access songs from context
    toggleLike,
    isPlayerVisible,
    setIsPlayerVisible,
  } = useMusic();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [hoveredSongId, setHoveredSongId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (songs && songs.length > 0) {
      setLoading(false); // Set the first song as default
    }
  }, [songs]);

  const handlePlayButtonClick = (song) => {
    if (currentSong?.id === song.id) {
      setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
    }
    setIsPlayerVisible(true);
  };

  const handleRowClick = (song) => {
    // Only update song but don't toggle play/pause
    // setCurrentSong(song);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    setSearchQuery("");
  };

  const songInfoClick = (song) => {
    // setActiveLink(song);
    setSelectedSong(song);
    setActiveLink("song");
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="songs-list-container">
      <div className="search-bar">
        {isSearchVisible ? (
          <>
            <input
              type="text"
              id="search-input"
              className="search-input"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaTimes className="search-icon" onClick={toggleSearch} />
          </>
        ) : (
          <FaSearch className="search-icon" onClick={toggleSearch} />
        )}
      </div>
      <div className="songs-header">
        <span className="header-id text-center">#</span>
        <span className="header-title ms-4">Title</span>
        <span className="header-artist text-center">Artist</span>
        <span className="header-duration text-center">
          <span className="duration-header-text">Duration</span> <FaClock />
        </span>
        <span className="header-album text-center">Album</span>
        <span className="header-releaseDate text-center">Release</span>
        <span className="header-likes text-center"></span>
      </div>
      <div className="songs-list">
        {filteredSongs.map((song, index) => (
          <div
            key={index}
            className={`song-item ${
              currentSong?.id === song.id ? "playing" : ""
            }`}
            onClick={() => handleRowClick(song)}
            onMouseEnter={() => setHoveredSongId(song.id)}
            onMouseLeave={() => setHoveredSongId(null)}
          >
            <div className="song-index text-center">
              {currentSong?.id === song.id && isPlaying ? (
                <FaPause
                  className="control-icon play-pause-button"
                  onClick={() => handlePlayButtonClick(song)}
                />
              ) : hoveredSongId === song.id ? (
                <FaPlay
                  className="control-icon play-pause-button"
                  onClick={() => handlePlayButtonClick(song)}
                />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="songs-song-info">
              <img
                src={song.imageUrl}
                alt="Song"
                className="song-image"
                onClick={() => songInfoClick(song)}
              />
              <div className="song-details">
                <span
                  className="song-title"
                  onClick={() => songInfoClick(song)}
                >
                  {song.title}
                </span>
                <span className="song-artist">{song.artistName}</span>
              </div>
            </div>
            <div className="song-artist-name">{song.artistName}</div>
            <div className="song-duration">{formatDuration(song.duration)}</div>
            <div className="song-album">{song.albumName || "-"}</div>
            <div className="song-releaseDate">{song.releaseDate || "-"}</div>
            <div className="song-likes">
              <FaHeart
                className={`song-heart-icon ${
                  likedSongs.has(song.id) ? "liked" : ""
                }`}
                onClick={() => {
                  // e.stopPropagation();
                  toggleLike(song.id);
                }}
              />
            </div>
          </div>
        ))}
        {filteredSongs.length === 0 && (
          <div className="no-more-songs">No Songs Available</div>
        )}
      </div>
    </div>
  );
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default SongsComponent;
