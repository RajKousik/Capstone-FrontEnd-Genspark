import axiosInstance from "../../axiosConfig";

// Function to submit a rating (POST)
const submitRating = async (ratingData) => {
  try {
    const response = await axiosInstance.post(`/ratings`, ratingData, {
      withCredentials: true,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error submitting rating:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to update a rating (PUT)
const updateRating = async (ratingData) => {
  try {
    const response = await axiosInstance.put(`/ratings`, ratingData, {
      withCredentials: true,
    });
    return response.data; // Return the updated rating data
  } catch (error) {
    console.error("Error updating rating:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to delete a rating (DELETE)
const deleteRating = async (userId, songId) => {
  try {
    const response = await axiosInstance.delete(
      `/ratings?userId=${userId}&songId=${songId}`,
      {
        withCredentials: true,
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error deleting rating:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to get ratings by user ID (GET)
const getRatingsByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/ratings/user/${userId}`, {
      withCredentials: true,
    });
    return response.data; // Return the ratings data
  } catch (error) {
    console.error("Error fetching ratings for user:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to get top-rated songs (GET)
const getTopRatedSongs = async () => {
  try {
    const response = await axiosInstance.get(`/ratings/top-rated`, {
      withCredentials: true,
    });
    return response.data; // Return the top-rated songs data
  } catch (error) {
    console.error("Error fetching top-rated songs:", error);
    throw error; // Rethrow the error for further handling
  }
};

export {
  submitRating,
  updateRating,
  deleteRating,
  getRatingsByUserId,
  getTopRatedSongs,
};
