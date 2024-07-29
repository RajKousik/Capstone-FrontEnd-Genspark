import axiosInstance from "../../axiosConfig";

const getArtistById = async (artistId) => {
  const response = await axiosInstance.get(`/artists/${artistId}`, {
    withCredentials: true,
  });
  return response.data;
};

export { getArtistById };
