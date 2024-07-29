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

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Mock song details
  const song = {
    id: 1,
    title: "Song One",
    artist: "Artist One",
    url: "/testing/audio/Come-on-Girls.mp3", // Example URL
    duration: 120, // Example duration in seconds
  };

  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const toggleLike = () => setIsLiked(!isLiked);

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

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className="left">
        <img
          src="https://via.placeholder.com/50"
          alt="Song"
          className="song-image"
        />
        <div className="song-info">
          <span className="song-name">{song.title}</span>
          <span className="song-artist">{song.artist}</span>
        </div>
        <FaHeart
          className={`heart-icon ${isLiked ? "liked" : ""}`}
          onClick={toggleLike}
        />
      </div>
      <div className="center">
        <div className="group">
          <span className="song-name" id="md-screen">
            {song.title}
          </span>
          <div className="controls">
            <FaStepBackward className="control-icon" />
            {isPlaying ? (
              <FaPause className="control-icon" onClick={togglePlayPause} />
            ) : (
              <FaPlay className="control-icon" onClick={togglePlayPause} />
            )}
            <FaStepForward className="control-icon" />
          </div>
          <div className="group-right">
            <FaHeart
              id="md-screen"
              className={`heart-icon ${isLiked ? "liked" : ""}`}
              onClick={toggleLike}
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
