import axiosInstance from "../../axiosConfig";

// Function to get an album by its ID
const getAlbumById = async (albumId) => {
  if (albumId !== null) {
    const response = await axiosInstance.get(`/albums/${albumId}`, {
      withCredentials: true,
    });
    return response.data;
  } else {
    return null;
  }
};

// Function to get albums by artist ID
const getAlbumByArtistId = async (artistId) => {
  try {
    const response = await axiosInstance.get(`/albums/artist/${artistId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error getting albums by artist ID:", error);
    return [];
  }
};

// Function to create a new album
const createAlbum = async (albumData) => {
  try {
    const response = await axiosInstance.post("/albums", albumData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating album:", error);
    return null;
  }
};

// Function to update an existing album by its ID
const updateAlbum = async (albumId, albumData) => {
  try {
    const response = await axiosInstance.put(`/albums/${albumId}`, albumData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating album:", error);
    return null;
  }
};

// Function to delete an album by its ID
const deleteAlbumById = async (albumId) => {
  try {
    const response = await axiosInstance.delete(`/albums/${albumId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting album:", error);
    return null;
  }
};

const deleteAlbumsRange = async (albumIds) => {
  try {
    const response = await axiosInstance.delete("/albums/range", {
      data: albumIds,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting albums range:", error);
    throw error;
  }
};

export {
  getAlbumById,
  getAlbumByArtistId,
  createAlbum,
  updateAlbum,
  deleteAlbumById,
  deleteAlbumsRange,
};
