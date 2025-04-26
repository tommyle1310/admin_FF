import { ChatResponse } from "@/types/chat";
import { io } from "socket.io-client";

// interface ChatResponse {
//   ongoing: Array<{
//     roomId: string;
//     type: string;
//     otherParticipant: {
//       userId: string;
//       userType: string;
//     };
//     lastMessage: {
//       id: string;
//       roomId: string;
//       senderId: string;
//       senderType: string;
//       content: string;
//       messageType: string;
//       timestamp: string;
//       readBy: string[];
//     };
//     lastActivity: string;
//     relatedId: string | null;
//   }>;
//   awaiting: Array<{
//     roomId: string;
//     type: string;
//     otherParticipant: {
//       userId: string;
//       userType: string;
//     };
//     lastMessage: {
//       id: string;
//       roomId: string;
//       senderId: string;
//       senderType: string;
//       content: string;
//       messageType: string;
//       timestamp: string;
//       readBy: string[];
//     };
//     lastActivity: string;
//     relatedId: string | null;
//   }>;
// }

interface ChatHistoryResponse {
  roomId: string;
  messages: Array<{
    id: string;
    roomId: string;
    senderId: string;
    senderType: string;
    content: string;
    messageType: string;
    timestamp: string;
    readBy: string[];
    customerSender?: { first_name: string; last_name: string } | null;
    driverSender?: { first_name: string; last_name: string } | null;
    restaurantSender?: { restaurant_name: string } | null;
    customerCareSender?: { first_name: string; last_name: string } | null;
  }>;
}

let socketInstance: ReturnType<typeof io> | null = null;

export const createSocket = (token: string | null) => {
  if (!token) {
    console.error("No token provided, cannot create socket");
    throw new Error("Authentication token is required");
  }

  // Trim token to avoid whitespace issues
  const trimmedToken = token.trim();
  console.log("Creating new socket with token: Bearer [REDACTED]", {
    tokenLength: trimmedToken.length,
    startsWithEy: trimmedToken.startsWith("eyJ"),
    tokenSnippet: trimmedToken.slice(0, 10) + "...",
  });

  if (socketInstance) {
    if (socketInstance.connected) {
      console.log("Reusing existing connected socket");
      return socketInstance;
    }
    console.log("Cleaning up disconnected socket");
    socketInstance.disconnect();
    socketInstance = null;
  }

  socketInstance = io("http://localhost:1310/chat", {
    transports: ["websocket"], // Match React Native
    auth: {
      token: `Bearer ${trimmedToken}`, // This sends the token in the auth object
    },

    reconnection: false, // Disable reconnection for debugging
  });

  socketInstance.on("connect", () => {
    console.log("Socket connected successfully");
  });

  socketInstance.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message, error);
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    if (reason === "io server disconnect") {
      console.error(
        "Server disconnected the socket. Possible causes: invalid token, missing auth header, or server-side validation failure."
      );
    }
  });

  socketInstance.on("error", (error) => {
    console.error("Server error:", error);
  });

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const chatSocket = {
  getAllChats: (socket: ReturnType<typeof io>) => {
    return new Promise<ChatResponse>((resolve, reject) => {
      console.log("Emitting getAllChats event");

      if (!socket.connected) {
        console.log("Socket not connected, attempting to connect...");
        socket.connect();
      }

      socket.emit(
        "getAllChats",
        (response: ChatResponse | { error: string }) => {
          console.log("Received response from getAllChats:", response);
          if ("error" in response) {
            console.error("Error in getAllChats response:", response.error);
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        }
      );
    });
  },

  getChatHistory: (socket: ReturnType<typeof io>, roomId: string) => {
    return new Promise<ChatHistoryResponse>((resolve, reject) => {
      console.log("Emitting getChatHistory event for room:", roomId);

      if (!socket.connected) {
        console.log("Socket not connected, attempting to connect...");
        socket.connect();
      }

      // Listen for chatHistory event
      const handleChatHistory = (response: ChatHistoryResponse) => {
        console.log("Received chat history:", response);
        socket.off("chatHistory", handleChatHistory);
        resolve(response);
      };

      socket.on("chatHistory", handleChatHistory);

      // Emit getChatHistory event
      socket.emit("getChatHistory", { roomId }, (error: string) => {
        if (error) {
          console.error("Error in getChatHistory:", error);
          socket.off("chatHistory", handleChatHistory);
          reject(error);
        }
      });
    });
  },
};
