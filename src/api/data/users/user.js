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

const getPremiumUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/users/premium-user?userId=${userId}`,
      {
        withCredentials: true,
      }
    );
    return response.data; // Return the user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to update user data by ID
const updateUserById = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData, {
      withCredentials: true,
    });
    return response.data; // Return the updated user data
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to change user password
const changeUserPassword = async (userId, passwordData) => {
  try {
    const response = await axiosInstance.put(
      `/users/change-password?userId=${userId}`,
      passwordData,
      {
        withCredentials: true,
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error changing user password:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to change user password
const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`/users`, {
      withCredentials: true,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to delete user by ID
const deleteUserById = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`, {
      withCredentials: true,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error; // Rethrow the error for further handling
  }
};

export {
  getUserById,
  updateUserById,
  changeUserPassword,
  getPremiumUserById,
  getAllUsers,
  deleteUserById, // Export the delete function
};
