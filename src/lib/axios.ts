import axios from "axios";
import { io, Socket } from "socket.io-client";
// import { API_BASE_URL } from '@/utils/constants/api';

interface ChatResponse {
  ongoing: Array<{
    roomId: string;
    type: string;
    otherParticipant: {
      userId: string;
      userType: string;
    };
    lastMessage: {
      id: string;
      roomId: string;
      senderId: string;
      senderType: string;
      content: string;
      messageType: string;
      timestamp: string;
      readBy: string[];
    };
    lastActivity: string;
    relatedId: string | null;
  }>;
  awaiting: Array<{
    roomId: string;
    type: string;
    otherParticipant: {
      userId: string;
      userType: string;
    };
    lastMessage: {
      id: string;
      roomId: string;
      senderId: string;
      senderType: string;
      content: string;
      messageType: string;
      timestamp: string;
      readBy: string[];
    };
    lastActivity: string;
    relatedId: string | null;
  }>;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:1310",
  headers: {
    "Content-Type": "application/json",
  },

  // withCredentials: true,
});

// Socket.io instance
export const socket: Socket = io("http://localhost:1310", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Chat related socket events
export const chatSocket = {
  getAllChats: () => {
    return new Promise<ChatResponse>((resolve, reject) => {
      socket.emit(
        "getAllChats",
        (response: ChatResponse | { error: string }) => {
          if ("error" in response) {
            reject(response.error);
          } else {
            resolve(response);
          }
        }
      );
    });
  },
};

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
