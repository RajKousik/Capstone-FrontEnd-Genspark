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

export { getAllSongs, getSongById };
