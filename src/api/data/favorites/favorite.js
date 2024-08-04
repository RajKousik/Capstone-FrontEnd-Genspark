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

//playlists

// Function to get favorite playlists by user ID
const getFavoritePlaylistsByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(
      `/favorites/playlists?userId=${userId}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching favorite playlists by user ID:", error);
    return [];
  }
};

// Function to add a favorite playlist for a user
const addFavoritePlaylist = async (userId, playlistId) => {
  const body = {
    userId: userId,
    playlistId: playlistId,
  };

  try {
    const response = await axiosInstance.post("/favorites/playlist", body, {
      withCredentials: true,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error adding favorite playlist:", error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to delete a favorite playlist for a user
const deleteFavoritePlaylist = async (userId, playlistId) => {
  const body = {
    userId: userId,
    playlistId: playlistId,
  };

  try {
    const response = await axiosInstance.delete("/favorites/playlist", {
      data: body,
      withCredentials: true,
    });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error deleting favorite playlist:", error);
    throw error; // Rethrow the error for further handling
  }
};

export {
  getFavoritesByUserId,
  addFavoriteSong,
  deleteFavoriteSong,
  getFavoritePlaylistsByUserId,
  addFavoritePlaylist,
  deleteFavoritePlaylist,
};
