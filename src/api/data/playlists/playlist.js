import axiosInstance from "../../axiosConfig";

// Function to get public playlists
const getPublicPlaylists = async () => {
  try {
    const response = await axiosInstance.get("/playlists/public", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching public playlists:", error);
    throw error;
  }
};

// Function to get user's playlists
const getUserPlaylists = async (userId) => {
  try {
    const response = await axiosInstance.get(`/playlists/user/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user's playlists:", error);
    throw error;
  }
};

// Function to create a playlist
const createPlaylist = async (playlistData) => {
  try {
    const response = await axiosInstance.post("/playlists", playlistData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating playlist:", error);
    throw error;
  }
};

// Function to delete a playlist
const deletePlaylist = async (playlistId) => {
  try {
    await axiosInstance.delete(`/playlists/${playlistId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    throw error;
  }
};

// Function to update a playlist
const updatePlaylist = async (playlistId, playlistData) => {
  try {
    const response = await axiosInstance.put(
      `/playlists/${playlistId}`,
      playlistData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating playlist:", error);
    throw error;
  }
};

// Function to get all playlists
const getAllPlaylists = async () => {
  try {
    const response = await axiosInstance.get("/playlists", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all playlists:", error);
    throw error;
  }
};

// Function to get a playlist by ID
const getPlaylistById = async (playlistId) => {
  try {
    const response = await axiosInstance.get(`/playlists/${playlistId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching playlist by ID:", error);
    throw error;
  }
};

export {
  getPublicPlaylists,
  getUserPlaylists,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  getAllPlaylists,
  getPlaylistById,
};
