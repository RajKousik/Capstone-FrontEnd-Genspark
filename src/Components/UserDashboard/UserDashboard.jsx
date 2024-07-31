// src/components/UserDashboard.js
import React, { useEffect, useState } from "react";
import MusicPlayer from "../MusicPlayerComponent/MusicPlayerComponent";
import NavbarComponent from "../NavbarComponent/NavbarComponent";
import SongsComponent from "../SongsComponent/SongsComponent";
import PlaylistComponent from "../PlaylistComponent/PlaylistComponent";
import "./UserDashboard.css";
import { getAllSongs } from "../../api/data/songs/song";
import { getArtistById } from "../../api/data/artists/artist";
import { getAlbumById } from "../../api/data/albums/album";
import { formatDateTime } from "../../api/utility/commonUtils";
import {
  getFavoritesByUserId,
  addFavoriteSong,
  deleteFavoriteSong,
} from "../../api/data/favorites/favorite";
import { useAuth } from "../../contexts/AuthContext";
import { useMusic } from "../../contexts/MusicContext";
import SongsPage from "../SongsComponent/SongsPage";
import CheckoutComponent from "../CheckoutComponent/CheckoutComponent";
import ProfileComponent from "../ProfileComponent/ProfileComponent";
import SongDetailComponent from "../SongComponent/SongComponent";

const UserDashboard = ({ activeLink, setActiveLink }) => {
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

  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    setActiveLink("songs");
  }, []);

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

  // function handleSongClick(song) {
  //   // setSelectedSong(song);
  //   setActiveLink("song");
  // }

  return (
    <div className="user-dashboard">
      <NavbarComponent
        userRole={user.role}
        activeLink={activeLink}
        setActiveComponent={setActiveLink}
      />
      <div className="content">
        {activeLink === "profile" && (
          <ProfileComponent
            activeLink={activeLink}
            setActiveComponent={setActiveLink}
          />
        )}
        {activeLink === "songs" && (
          <SongsPage
            activeLink={activeLink}
            setSelectedSong={setSelectedSong}
            setActiveLink={setActiveLink}
          />
        )}
        {activeLink === "playlists" && <PlaylistComponent />}
        {activeLink === "explore-premium" && <CheckoutComponent />}
        {activeLink === "song" && <SongDetailComponent song={selectedSong} />}
        {/* Add more components based on activeLink */}
      </div>
      <MusicPlayer />
    </div>
  );
};

export default UserDashboard;
