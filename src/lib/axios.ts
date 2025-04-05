import { BACKEND_URL } from "@/constants/links";
import axios from "axios";
// import { API_BASE_URL } from '@/utils/constants/api';

const axiosInstance = axios.create({
  baseURL: "http://localhost:1310",
  headers: {
    "Content-Type": "application/json",
  },

  // withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          break;
        case 403:
          break;
        case 404:
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
