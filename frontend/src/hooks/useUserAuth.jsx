import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axios";
import { API_PATH } from "../Utils/apipath";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && !user) {
      updateUser(JSON.parse(storedUser));
    }

    const token = localStorage.getItem("token");
    if (!token || user) return;

    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_USER_INFO);

        if (isMounted && response.data) {
          updateUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        console.error("API Error:", error);
        if (isMounted) {
          clearUser();
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
  
    fetchUserInfo();

    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, navigate]); // Removed `user` to prevent unnecessary re-renders

  return user;
};
