import axiosInstance from "../../axiosConfig";

// Function to get artist data by ID
const getArtistById = async (artistId) => {
  try {
    const response = await axiosInstance.get(`/artists/${artistId}`, {
      withCredentials: true,
    });
    return response.data; // Return the artist data
  } catch (error) {
    console.error("Error fetching artist data:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to get all artists
const getAllArtists = async () => {
  try {
    const response = await axiosInstance.get(`/artists`, {
      withCredentials: true,
    });
    return response.data; // Return the list of artists
  } catch (error) {
    console.error("Error retrieving artists:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to delete artist by ID
const deleteArtist = async (artistId) => {
  try {
    const response = await axiosInstance.delete(`/artists/${artistId}`, {
      withCredentials: true,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error deleting artist:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to update artist data by ID
const updateArtist = async (artistId, artistData) => {
  try {
    const response = await axiosInstance.put(
      `/artists/${artistId}`,
      artistData,
      {
        withCredentials: true,
      }
    );
    return response.data; // Return the updated artist data
  } catch (error) {
    console.error("Error updating artist data:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to change artist password
const changeArtistPassword = async (artistId, passwordData) => {
  try {
    const response = await axiosInstance.put(
      `/artists/change-password?artistId=${artistId}`,
      passwordData,
      {
        withCredentials: true,
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error changing artist password:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to get songs by artist ID
const getSongsByArtistId = async (artistId) => {
  try {
    const response = await axiosInstance.get(`/artists/${artistId}/songs`, {
      withCredentials: true,
    });
    return response.data; // Return the list of songs for the artist
  } catch (error) {
    console.error("Error fetching songs for artist:", error);
    throw error; // Rethrow the error for further handling
  }
};

export {
  getArtistById,
  getAllArtists,
  deleteArtist,
  updateArtist,
  changeArtistPassword,
  getSongsByArtistId,
};
