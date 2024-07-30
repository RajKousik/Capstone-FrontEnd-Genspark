// src/components/UserDashboard.js
import React, { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayerComponent";
import NavbarComponent from "./NavbarComponent";
import SongsComponent from "./SongsComponent";
import PlaylistComponent from "./PlaylistComponent";
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
import { useMusic } from "../contexts/MusicContext";
import SongsPage from "./SongsPage";
import CheckoutComponent from "./CheckoutComponent";

const UserDashboard = () => {
  const { user } = useAuth();
  const {
    setCurrentSong,
    setIsPlaying,
    likedSongs,
    setLikedSongs,
    setSongs,
    toggleLike,
  } = useMusic();

  const [songsData, setSongsData] = useState([]);
  const [activeLink, setActiveLink] = useState("songs"); // Default active link

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
      setSongs(enrichedSongs);
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
  }, [user, setCurrentSong, setLikedSongs, setSongs]);

  // const toggleLike = async (songId) => {
  //   if (likedSongs.has(songId)) {
  //     await deleteFavoriteSong(user.userId, songId);
  //     setLikedSongs((prevLikedSongs) => {
  //       const newLikedSongs = new Set(prevLikedSongs);
  //       newLikedSongs.delete(songId);
  //       return newLikedSongs;
  //     });
  //   } else {
  //     await addFavoriteSong(user.userId, songId);
  //     setLikedSongs((prevLikedSongs) => new Set(prevLikedSongs).add(songId));
  //   }
  // };

  return (
    <div className="user-dashboard">
      <NavbarComponent
        activeLink={activeLink}
        setActiveComponent={setActiveLink}
      />
      <div className="content">
        {activeLink === "songs" && <SongsPage activeLink={activeLink} />}
        {activeLink === "playlists" && <PlaylistComponent />}
        {activeLink === "explore-premium" && <CheckoutComponent />}
        {/* Add more components based on activeLink */}
      </div>
      <MusicPlayer />
    </div>
  );
};

export default UserDashboard;
