import axiosInstance from "../../axiosConfig";

// Function to get user data by ID
const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`, {
      withCredentials: true,
    });
    return response.data; // Return the user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Rethrow the error for further handling
  }
};

export { getUserById };
