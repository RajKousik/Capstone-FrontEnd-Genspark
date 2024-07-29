import React, { createContext, useState, useEffect, useContext } from "react";

// Create a context for authentication
const AuthContext = createContext();

const getInitialState = () => {
  const storedData = localStorage.getItem("authData");
  return storedData
    ? JSON.parse(storedData)
    : { storedUser: null, storedToken: null, storedIsAuthenticated: false };
};

export const AuthProvider = ({ children }) => {
  const { storedUser, storedToken, storedIsAuthenticated } = getInitialState();

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [isAuthenticated, setIsAuthenticated] = useState(storedIsAuthenticated);

  useEffect(() => {
    localStorage.setItem(
      "authData",
      JSON.stringify({
        storedUser: user,
        storedToken: token,
        storedIsAuthenticated: isAuthenticated,
      })
    );
  }, [user, token, isAuthenticated]);

  // Function to set user data and token
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  // Function to clear user data and token
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
