import axiosInstance from "../../axiosConfig";

const getAllSongs = async () => {
  const response = await axiosInstance.get("/songs", {
    withCredentials: true,
  });
  return response.data;
};

const getSongById = async (songId) => {
  const response = await axiosInstance.get(`/songs/${songId}`, {
    withCredentials: true,
  });
  return response.data;
};

const getSongByGenre = async (genre) => {
  const response = await axiosInstance.get(`/songs/genre?genre=${genre}`, {
    withCredentials: true,
  });
  return response.data;
};

const deleteSongById = async (songId) => {
  try {
    const response = await axiosInstance.delete(`/songs/${songId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting song:", error);
    throw error;
  }
};

// Function to add a new song
const createSong = async (song) => {
  try {
    const response = await axiosInstance.post("/songs", song, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding song:", error);
    throw error;
  }
};

// Function to update an existing song
const updateSong = async (songId, updatedSong) => {
  try {
    const response = await axiosInstance.put(`/songs/${songId}`, updatedSong, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating song:", error);
    throw error;
  }
};

const deleteSongsRange = async (songIds) => {
  try {
    const response = await axiosInstance.delete("/songs/range", {
      data: songIds,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting songs range:", error);
    throw error;
  }
};

export {
  getAllSongs,
  getSongById,
  getSongByGenre,
  deleteSongById,
  createSong,
  updateSong,
  deleteSongsRange,
};
