import React, { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown, Button } from "react-bootstrap";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
  FaHeart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import "../css/MusicPlayer.css";
import { useMusic } from "../contexts/MusicContext";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";

const MusicPlayer = () => {
  const audioRef = useRef(null);

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

  useEffect(() => {
    setIsPlayerVisible(false);
  }, []);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(5);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // const [isPlayerVisible, setIsPlayerVisible] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const activeElement = document.activeElement;

      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA")
      ) {
        return; // Do nothing if an input or textarea is focused
      }

      if (event.code === "Space") {
        event.preventDefault(); // Prevent default behavior like scrolling
        setIsPlaying((prev) => !prev);
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
        audioRef?.current?.removeEventListener("ended", handleNext);
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
    if (isMuted && volume == 0) {
      setVolume(10);
    }
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
    <>
      <div
        className={`position-fixed ${isPlayerVisible ? "hidden" : ""}`}
        style={{ bottom: "5px", left: "5px" }}
      >
        <IoIosArrowDropupCircle
          onClick={() => setIsPlayerVisible(true)}
          className="toggle-icon"
          style={{ cursor: "pointer", fontSize: "30px", color: "#ffa500" }}
        />
      </div>
      <div className={`music-player ${isPlayerVisible ? "" : "hidden"}`}>
        <audio
          ref={audioRef}
          src={currentSong ? currentSong.url : ""}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
        <div
          className="toggle-visibility position-fixed"
          style={{ bottom: "75px" }}
        >
          {isPlayerVisible && (
            <IoIosArrowDropdownCircle
              onClick={() => setIsPlayerVisible(false)}
              className="toggle-icon position-relative"
              style={{ fontSize: "25px", top: "5px", cursor: "pointer" }}
            />
          )}
        </div>
        <div className="left">
          <img
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
    </>
  );
};

export default MusicPlayer;
