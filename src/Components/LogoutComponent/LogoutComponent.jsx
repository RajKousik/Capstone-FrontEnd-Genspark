import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { logoutUser } from "../../api/data/auth/auth";

const Logout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      //   toast.loading("Logging out", {
      //     position: "top-right",
      //     autoClose: 100,
      //     pauseOnHover: false,
      //   });
      setTimeout(async () => {
        await logoutUser();
        logout();
        if (user?.role?.toLowerCase() === "artist") {
          navigate("/artist/login");
        } else {
          navigate("/login");
        }
      }, 1000);
    };

    handleLogout();
  }, [logoutUser, logout, navigate, user]);

  return null;
};

export default Logout;
