import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getFavoritesByUserId,
  addFavoriteSong,
  deleteFavoriteSong,
} from "../api/data/favorites/favorite";
import { useAuth } from "./AuthContext";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const { user } = useAuth(); // Access user from AuthContext

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set());
  const [songs, setSongs] = useState([]);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);

  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      if (user) {
        const favoriteSongs = await getFavoritesByUserId(user.userId);
        const favoriteSongIds = new Set(
          favoriteSongs.map((song) => song.songId)
        );
        setLikedSongs(favoriteSongIds);
      }
    };

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
    <MusicContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        likedSongs,
        setLikedSongs,
        songs,
        setSongs,
        toggleLike, // Add toggleLike function to context
        isPlayerVisible,
        setIsPlayerVisible,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  return useContext(MusicContext);
};
