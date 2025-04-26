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
}

interface ChatRoom {
  roomId: string;
  type: string;
  otherParticipant: Participant;
  lastMessage: LastMessage;
  lastActivity: string;
  relatedId: string | null;
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: string;
  content: string;
  messageType: string;
  timestamp: string;
  readBy: string[];
  customerSender?: CustomerSender | null;
  driverSender?: DriverSender | null;
  restaurantSender?: RestaurantSender | null;
  customerCareSender?: CustomerCareSender | null;
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
      // Chọn phòng chat đầu tiên nếu có
      if (result.ongoing.length > 0) {
        const firstRoomId = result.ongoing[0].roomId;
        setSelectedRoomId(firstRoomId);
        fetchChatHistory(socketInstance, firstRoomId);
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

    if (newSocket.connected) {
      console.log("Socket already connected, fetching chats...");
      fetchAllChats(newSocket);
    }

    return () => {
      console.log("Component unmounting, cleaning up socket...");
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("error");
      newSocket.disconnect();
    };
  }, []);

  // Khi chọn một phòng chat, fetch lịch sử trò chuyện
  useEffect(() => {
    if (selectedRoomId && socket) {
      fetchChatHistory(socket, selectedRoomId);
    }
  }, [selectedRoomId]);

  // Hàm format thời gian
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Convert to seconds
    const seconds = Math.floor(diff / 1000);

    // Less than a minute
    if (seconds < 60) {
      return "Just now";
    }

    // Less than an hour
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }

    // Less than a day
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h`;
    }

    // Less than a week
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}d`;
    }

    // Less than a month
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks}w`;
    }

    // Less than a year
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months}mo`;
    }

    // More than a year
    const years = Math.floor(months / 12);
    return `${years}y`;
  };

  // Hàm lấy tên sender
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

  // Hàm lấy avatar URL
  const getSenderAvatar = (message: ChatMessage) => {
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

  // Hàm kiểm tra tin nhắn có phải từ người dùng hiện tại không (Customer Care)
  const isCurrentUser = (message: ChatMessage) => {
    return message.senderType === "CUSTOMER_CARE_REPRESENTATIVE";
  };

  // Hàm lấy tên participant
  const getParticipantName = (chat: ChatRoom) => {
    const sender = chat.lastMessage.sender;
    if (!sender) return "Unknown";
    if ("restaurant_name" in sender) {
      return sender.restaurant_name;
    }
    return `${sender.first_name} ${sender.last_name}`;
  };

  // Dữ liệu cho phòng chat được chọn
  const selectedChat =
    chats.ongoing.find((chat) => chat.roomId === selectedRoomId) ||
    chats.awaiting.find((chat) => chat.roomId === selectedRoomId);

  const handleSendMessage = () => {
    if (message.trim() && selectedRoomId && socket) {
      // Thêm code để gửi tin nhắn ở đây
      // socket.emit("sendMessage", { roomId: selectedRoomId, content: message });
      setMessage("");
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
        {/* Search Bar */}
        <Input placeholder="Search" className="mb-4 bg-white" />

        {/* Ongoing Chats Section */}
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
                    src={getSenderAvatar(chat.lastMessage)}
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

        {/* Waiting List Section */}
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
                    src={getSenderAvatar(chat.lastMessage)}
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
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={
                  selectedChat && chatHistory.length > 0
                    ? getSenderAvatar(chatHistory[0])
                    : ""
                }
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

        {/* Chat Messages */}
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

        {/* Message Input */}
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
