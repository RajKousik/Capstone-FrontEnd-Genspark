import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
  FaHeart,
} from "react-icons/fa";
import "../css/MusicPlayer.css";

const MusicPlayer = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  likedSongs,
  toggleLike,
  songs, // Added prop for the list of songs
  setCurrentSong, // Added prop to update the current song
}) => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentSong === null) {
      setCurrentSong(songs[0]);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (document.activeElement !== document.getElementById("search-input")) {
        if (event.code === "Space") {
          event.preventDefault(); // Prevent scrolling when space bar is pressed
          setIsPlaying((prev) => !prev);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleNext);
      return () => {
        audioRef.current.removeEventListener("ended", handleNext);
      };
    }
  }, [currentSong, songs]);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
    if (newVolume === "0") {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePrevious = () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[previousIndex]);
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentSong ? currentSong.url : ""}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="left">
        <img
          // src="https://via.placeholder.com/50"
          src={currentSong?.imageUrl || "https://via.placeholder.com/50"}
          alt="Song"
          className="song-image"
        />
        <div className="song-info">
          <span className="song-name">
            {currentSong?.title || "Unknown Title"}
          </span>
          <span className="song-artist">
            {currentSong?.artistName || "Unknown Artist"}
          </span>
        </div>
        <FaHeart
          className={`control-icon heart-icon ${
            likedSongs.has(currentSong?.id) ? "liked" : ""
          }`}
          onClick={() => toggleLike(currentSong?.id)}
        />
      </div>
      <div className="center">
        <div className="group">
          <span className="song-name" id="md-screen">
            {currentSong?.title || "Unknown Title"}
          </span>
          <div className="controls">
            <FaStepBackward
              className={`control-icon ${
                songs?.findIndex((song) => song?.id === currentSong?.id) === 0
                  ? "disabled"
                  : ""
              }`}
              onClick={handlePrevious}
            />
            {isPlaying ? (
              <FaPause
                className="control-icon pause-button"
                onClick={togglePlayPause}
              />
            ) : (
              <FaPlay
                className="control-icon play-button"
                onClick={togglePlayPause}
              />
            )}
            <FaStepForward
              className={`control-icon ${
                songs.findIndex((song) => song.id === currentSong.id) ===
                songs.length - 1
                  ? "disabled"
                  : ""
              }`}
              onClick={handleNext}
            />
          </div>

          <div className="group-right">
            <FaHeart
              id="md-screen"
              className={`control-icon heart-icon ${
                likedSongs.has(currentSong?.id) ? "liked" : ""
              }`}
              onClick={() => toggleLike(currentSong?.id)}
            />
            <div className="volume-control" id="volume-icon">
              {isMuted ? (
                <FaVolumeMute
                  className="control-icon volume-icon"
                  onClick={toggleMute}
                />
              ) : (
                <FaVolumeUp
                  className="control-icon volume-icon"
                  onClick={toggleMute}
                />
              )}
              <div className="volume-input">
                <input
                  type="range"
                  className="volume"
                  id="input-volume"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="progress-container">
          <span className="time start">
            {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, "0")}
          </span>
          <input
            type="range"
            className="progress"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => (audioRef.current.currentTime = e.target.value)}
          />
          <span className="time end">
            {Math.floor(duration / 60)}:
            {Math.floor(duration % 60)
              .toString()
              .padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="right">
        <div className="volume-control">
          {isMuted ? (
            <FaVolumeMute className="control-icon" onClick={toggleMute} />
          ) : (
            <FaVolumeUp className="control-icon" onClick={toggleMute} />
          )}
          <input
            type="range"
            className="volume"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
