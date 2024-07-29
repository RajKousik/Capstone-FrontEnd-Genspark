import axiosInstance from "../../axiosConfig";

const getAllSongs = async () => {
  const response = await axiosInstance.get("/songs", {
    withCredentials: true,
  });
  return response.data;
};

export { getAllSongs };
