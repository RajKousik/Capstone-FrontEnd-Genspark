import axiosInstance from "../../axiosConfig";

// Function to add a song to a playlist
const addSongToPlaylist = async (playlistId, songId) => {
  const body = { playlistId, songId };
  try {
    const response = await axiosInstance.post("/playlist-songs", body, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
};

// Function to remove a song from a playlist
const removeSongFromPlaylist = async (playlistId, songId) => {
  const body = { playlistId, songId };
  try {
    const response = await axiosInstance.delete("/playlist-songs", {
      data: body,
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    throw error;
  }
};

// Function to get all songs in a playlist by ID
const getSongsByPlaylistId = async (playlistId) => {
  try {
    const response = await axiosInstance.get(`/playlist-songs/${playlistId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching songs by playlist ID:", error);
    return null;
  }
};

// Function to clear all songs from a playlist
const clearSongsFromPlaylist = async (playlistId) => {
  try {
    await axiosInstance.delete(`/playlist-songs/clear/${playlistId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error clearing songs from playlist:", error);
    throw error;
  }
};

export {
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSongsByPlaylistId,
  clearSongsFromPlaylist,
};
