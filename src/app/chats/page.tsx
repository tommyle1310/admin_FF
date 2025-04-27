"use client";

import { useEffect, useState } from "react";
import {
  Paperclip,
  Smile,
  Camera,
  Mic,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomerCareStore } from "@/stores/customerCareStore";
import { useAdminStore } from "@/stores/adminStore";
import { chatSocket, createSocket } from "@/lib/socket";
import {
  ChatResponse,
  CustomerCareSender,
  CustomerSender,
  DriverSender,
  RestaurantSender,
  ChatMessage,
  Message,
} from "@/types/chat";

interface Avatar {
  key: string;
  url: string;
}

interface LastMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: string;
  content: string;
  messageType: string;
  timestamp: string;
  readBy: string[];
  customerSender: CustomerSender | null;
  driverSender: DriverSender | null;
  restaurantSender: RestaurantSender | null;
  customerCareSender: CustomerCareSender | null;
  sender:
    | CustomerSender
    | DriverSender
    | RestaurantSender
    | CustomerCareSender
    | null;
}

interface Participant {
  userId: string;
  userType: string;
  first_name?: string;
  last_name?: string;
  restaurant_name?: string;
  avatar?: Avatar | null;
  phone?: string;
  contact_email?: string[];
  contact_phone?: { phone: string }[];
}

interface ChatRoom {
  roomId: string;
  type: string;
  otherParticipant: Participant;
  lastMessage: LastMessage;
  lastActivity: string;
  relatedId: string | null;
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatResponse>({
    ongoing: [],
    awaiting: [],
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<ReturnType<typeof createSocket> | null>(
    null
  );

  const getAccessToken = () => {
    const customerCareStore = useCustomerCareStore.getState();
    const adminStore = useAdminStore.getState();
    return customerCareStore.isAuthenticated && customerCareStore.user
      ? customerCareStore.user.accessToken
      : adminStore.isAuthenticated && adminStore.user
      ? adminStore.user.accessToken
      : null;
  };

  const fetchAllChats = async (
    socketInstance: ReturnType<typeof createSocket>
  ) => {
    try {
      console.log("Starting to fetch all chats...");
      console.log("Socket connection status:", socketInstance.connected);

      const result = await chatSocket.getAllChats(socketInstance);
      console.log("Successfully fetched chats:", result);
      setChats(result);
      // Select the first chat room if available
      if (result.ongoing.length > 0 && !selectedRoomId) {
        const firstRoomId = result.ongoing[0].roomId;
        setSelectedRoomId(firstRoomId);
      }
      return result;
    } catch (error) {
      console.error("Error in fetchAllChats:", error);
      throw error;
    }
  };

  const fetchChatHistory = async (
    socketInstance: ReturnType<typeof createSocket>,
    roomId: string
  ) => {
    try {
      console.log("Fetching chat history for room:", roomId);
      const result = await chatSocket.getChatHistory(socketInstance, roomId);
      console.log("Successfully fetched chat history:", result);
      setChatHistory(result.messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  useEffect(() => {
    console.log("Component mounted, initializing socket...");
    const token = getAccessToken();
    if (!token) {
      console.error("No token provided, skipping socket connection");
      return;
    }

    const newSocket = createSocket(token);
    setSocket(newSocket);

    const handleConnect = () => {
      console.log("Socket connected in component");
      fetchAllChats(newSocket);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected in component");
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("error", (error) => {
      console.error("Socket server error:", error);
    });

    // Set up new message listener
    chatSocket.onNewMessage(newSocket, (message: ChatMessage) => {
      console.log("New message received:", message);
      if (message.roomId === selectedRoomId) {
        setChatHistory((prev) => [...prev, message]);
      }
      // Fetch all chats to update the sidebar (optional for synchronization)
      fetchAllChats(newSocket);
    });

    if (newSocket.connected) {
      console.log("Socket already connected, fetching chats...");
      fetchAllChats(newSocket);
    }

    return () => {
      console.log("Component unmounting, cleaning up socket...");
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("error");
      newSocket.off("newMessage");
      newSocket.disconnect();
    };
  }, []);

  // Fetch chat history when selectedRoomId changes
  useEffect(() => {
    if (selectedRoomId && socket) {
      fetchChatHistory(socket, selectedRoomId);
    }
  }, [selectedRoomId, socket]);

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo`;
    const years = Math.floor(months / 12);
    return `${years}y`;
  };

  // Get sender name
  const getSenderName = (message: ChatMessage) => {
    if (message.customerSender) {
      return `${message.customerSender.first_name} ${message.customerSender.last_name}`;
    } else if (message.driverSender) {
      return `${message.driverSender.first_name} ${message.driverSender.last_name}`;
    } else if (message.restaurantSender) {
      return message.restaurantSender.restaurant_name;
    } else if (message.customerCareSender) {
      return `${message.customerCareSender.first_name} ${message.customerCareSender.last_name}`;
    }
    return "Unknown";
  };

  // Get sender avatar
  const getSenderAvatar = (message: ChatMessage | Message) => {
    if (message.customerSender && message.customerSender.avatar) {
      return message.customerSender.avatar.url;
    } else if (message.driverSender && message.driverSender.avatar) {
      return message.driverSender.avatar.url;
    } else if (message.restaurantSender && message.restaurantSender.avatar) {
      return message.restaurantSender.avatar.url;
    } else if (
      message.customerCareSender &&
      message.customerCareSender.avatar
    ) {
      return message.customerCareSender.avatar.url;
    }
    return "";
  };

  // Check if message is from current user
  const isCurrentUser = (message: ChatMessage) => {
    return message.senderType === "CUSTOMER_CARE_REPRESENTATIVE";
  };

  // Get participant name
  const getParticipantName = (chat: ChatRoom) => {
    const participant = chat.otherParticipant;
    if (!participant) return "Unknown";
    if (participant.restaurant_name) {
      return participant.restaurant_name;
    }
    return (
      `${participant.first_name || ""} ${participant.last_name || ""}`.trim() ||
      "Unknown"
    );
  };

  // Get participant avatar
  const getParticipantAvatar = (chat: ChatRoom) => {
    return chat.otherParticipant?.avatar?.url || "";
  };

  const selectedChat =
    chats.ongoing.find((chat) => chat.roomId === selectedRoomId) ||
    chats.awaiting.find((chat) => chat.roomId === selectedRoomId);

  const handleSendMessage = async () => {
    if (message.trim() && selectedRoomId && socket) {
      try {
        const newMessage = await chatSocket.sendMessage(
          socket,
          selectedRoomId,
          message,
          "TEXT"
        );
        setChatHistory((prev) => [...prev, newMessage]);
        setMessage("");
        // Fetch all chats to update the sidebar (optional)
        await fetchAllChats(socket);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 gap-4 p-4">
        <Input placeholder="Search" className="mb-4 bg-white" />
        <div className="flex-col mb-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2 bg-white">Ongoing chats</h2>
          <div className="space-y-2">
            {chats.ongoing.map((chat) => (
              <div
                key={chat.roomId}
                className={`flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer ${
                  selectedRoomId === chat.roomId ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedRoomId(chat.roomId)}
              >
                <Avatar>
                  <AvatarImage
                    src={getParticipantAvatar(chat)}
                    alt={getParticipantName(chat)}
                  />
                  <AvatarFallback>
                    {getParticipantName(chat)[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">
                      {getParticipantName(chat)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {chat.lastMessage.content}
                    </span>
                    {chat.lastMessage.readBy.length === 1 && (
                      <Badge className="bg-danger-500 h-5 text-white">1</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-col bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mt-4 mb-2 bg-white">
            Waiting list
          </h2>
          <div className="space-y-2">
            {chats.awaiting.map((chat) => (
              <div
                key={chat.roomId}
                className={`flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer ${
                  selectedRoomId === chat.roomId ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedRoomId(chat.roomId)}
              >
                <Avatar>
                  <AvatarImage
                    src={getParticipantAvatar(chat)}
                    alt={getParticipantName(chat)}
                  />
                  <AvatarFallback>
                    {getParticipantName(chat)[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {getParticipantName(chat)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTime(chat.lastMessage.timestamp)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {chat.lastMessage.content}
                    </span>
                    {chat.lastMessage.readBy.length === 1 && (
                      <Badge className="bg-danger-500 h-4 text-white">1</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col m-4 rounded-lg bg-white overflow-hidden shadow-md">
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={selectedChat ? getParticipantAvatar(selectedChat) : ""}
                alt={selectedChat ? getParticipantName(selectedChat) : "User"}
              />
              <AvatarFallback>
                {selectedChat ? getParticipantName(selectedChat)[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">
                {selectedChat ? getParticipantName(selectedChat) : "User"}
              </h2>
              <p className="text-sm text-gray-500">
                Online - Last seen{" "}
                {selectedChat
                  ? formatTime(selectedChat.lastActivity)
                  : "Unknown"}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                isCurrentUser(msg) ? "justify-end" : "justify-start"
              } mb-4`}
            >
              {!isCurrentUser(msg) && (
                <Avatar className="mr-2 mt-1">
                  <AvatarImage
                    src={getSenderAvatar(msg)}
                    alt={getSenderName(msg)}
                  />
                  <AvatarFallback>
                    {getSenderName(msg)[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  isCurrentUser(msg)
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isCurrentUser(msg) ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border-t border-gray-200 p-4 flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Camera className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-primary"
            onClick={handleSendMessage}
          >
            <Mic className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
