import axiosInstance from "../../axiosConfig";

// Function to log out the user
const logoutUser = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout", null, {
      withCredentials: true, // Include credentials in the request
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error logging out:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export { logoutUser };
