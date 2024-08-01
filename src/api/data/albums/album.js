import axiosInstance from "../../axiosConfig";

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
    return null;
  }
};

export { getAlbumById, getAlbumByArtistId };
