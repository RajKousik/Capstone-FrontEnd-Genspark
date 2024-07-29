import axiosInstance from "../../axiosConfig";

// Function to get favorite songs by user ID
const getFavoritesByUserId = async (userId) => {
  const response = await axiosInstance.get(
    `/favorites/songs?userId=${userId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};

// Function to add a favorite song for a user
const addFavoriteSong = async (userId, songId) => {
  const body = {
    userId: userId,
    songId: songId,
  };

  try {
    const response = await axiosInstance.post("/favorites/song", body, {
      withCredentials: true,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error adding favorite song:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to delete a favorite song for a user
const deleteFavoriteSong = async (userId, songId) => {
  const body = {
    userId: userId,
    songId: songId,
  };

  try {
    const response = await axiosInstance.delete("/favorites/song", {
      data: body,
      withCredentials: true,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error deleting favorite song:", error);
    throw error; // Rethrow the error for further handling
  }
};

export { getFavoritesByUserId, addFavoriteSong, deleteFavoriteSong };
