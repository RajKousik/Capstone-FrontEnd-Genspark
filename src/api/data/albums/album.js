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

export { getAlbumById };
