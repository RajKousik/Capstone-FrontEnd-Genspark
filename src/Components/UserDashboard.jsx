import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MusicPlayer from "./MusicPlayerComponent";
import NavbarComponent from "./NavbarComponent";
import SongsComponent from "./SongsComponent";
import "../css/UserDashboard.css";
import { getAllSongs } from "../api/data/songs/song";
import { getArtistById } from "../api/data/artists/artist";
import { getAlbumById } from "../api/data/albums/album";
import { formatDateTime } from "../api/utility/commonUtils";
import {
  getFavoritesByUserId,
  addFavoriteSong,
  deleteFavoriteSong,
} from "../api/data/favorites/favorite";
import { useAuth } from "../contexts/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth(); // Get user info
  const [songsData, setSongsData] = useState([]);
  const [currentSong, setCurrentSong] = useState(songsData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set()); // Manage liked songs

  useEffect(() => {
    const fetchSongsData = async () => {
      const songs = await getAllSongs();
      const enrichedSongs = await Promise.all(
        songs.map(async (song) => {
          const artist = await getArtistById(song.artistId);
          const album = await getAlbumById(song.albumId);
          return {
            ...song,
            artistName: artist.name,
            albumName: album ? album.title : "Single",
            releaseDate: formatDateTime(song.releaseDate),
            id: song.songId,
          };
        })
      );
      setSongsData(enrichedSongs);
      if (enrichedSongs.length > 0) {
        setCurrentSong(enrichedSongs[0]);
      }
    };

    const fetchFavoriteSongs = async () => {
      if (user) {
        const favoriteSongs = await getFavoritesByUserId(user.userId);

        const favoriteSongIds = new Set(
          favoriteSongs.map((song) => song.songId)
        );

        setLikedSongs(favoriteSongIds);
      }
    };

    fetchSongsData();
    fetchFavoriteSongs();
  }, [user]);

  const toggleLike = async (songId) => {
    if (likedSongs.has(songId)) {
      await deleteFavoriteSong(user.userId, songId);
      setLikedSongs((prevLikedSongs) => {
        const newLikedSongs = new Set(prevLikedSongs);
        newLikedSongs.delete(songId);
        return newLikedSongs;
      });
    } else {
      await addFavoriteSong(user.userId, songId);
      setLikedSongs((prevLikedSongs) => new Set(prevLikedSongs).add(songId));
    }
  };

  return (
    <div className="user-dashboard">
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
                songs={songsData}
              />
            }
          />
          {/* Add other routes as needed */}
        </Routes>
      </div>
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        likedSongs={likedSongs}
        toggleLike={toggleLike}
        setCurrentSong={setCurrentSong}
        songs={songsData}
      />
    </div>
  );
};

export default UserDashboard;
