import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      
      if (status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        localStorage.removeItem("token");
   
      } else if (status === 500) {
        console.error("Internal Server Error");
      } else if (status === 400) {
        console.warn("Bad Request! Check your input.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out. Retrying...");
      
      // Retry logic
      const config = error.config;
      if (!config._retry) {
        config._retry = true;
        return axiosInstance(config);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
