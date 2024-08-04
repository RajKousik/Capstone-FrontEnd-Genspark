import React, { useEffect, useState } from "react";
import { useMusic } from "../../contexts/MusicContext";
import SongsComponent from "./SongsComponent";
import { useAuth } from "../../contexts/AuthContext";
import { getAllSongs } from "../../api/data/songs/song";
import { getArtistById } from "../../api/data/artists/artist";
import { getAlbumById } from "../../api/data/albums/album";
import { formatDateTime } from "../../api/utility/commonUtils";
import {
  getFavoritesByUserId,
  addFavoriteSong,
  deleteFavoriteSong,
} from "../../api/data/favorites/favorite";

const SongsPage = ({ activeLink, setActiveLink, setSelectedSong }) => {
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    likedSongs,
    setLikedSongs,
    songs, // Access songs from context
    setSongs,
  } = useMusic();

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongsData = async () => {
      const allSongs = await getAllSongs();
      const enrichedSongs = await Promise.all(
        allSongs.map(async (song) => {
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

    // fetchSongsData();
    // fetchFavoriteSongs();
    setLoading(false);
  }, [user, setCurrentSong, setLikedSongs, setSongs, activeLink]);
  if (loading) {
    return (
      <div className="text-center mt-5 home-container">
        <div
          className="spinner-border"
          role="status"
          style={{ color: "#ffa500" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <SongsComponent
      setActiveLink={setActiveLink}
      setSelectedSong={setSelectedSong}
    />
  );
};

export default SongsPage;
