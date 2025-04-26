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

interface LastMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderType: string;
  content: string;
  messageType: string;
  timestamp: string;
  readBy: string[];
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

interface ChatsResponse {
  ongoing: ChatRoom[];
  awaiting: ChatRoom[];
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<ReturnType<typeof createSocket> | null>(
    null
  );
  const [chats, setChats] = useState<ChatsResponse>({
    ongoing: [],
    awaiting: [],
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

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
        setSelectedRoomId(result.ongoing[0].roomId);
      }
      return result;
    } catch (error) {
      console.error("Error in fetchAllChats:", error);
      throw error;
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
      setIsConnected(true);
      fetchAllChats(newSocket);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected in component");
      setIsConnected(false);
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

  // Hàm format thời gian
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (days === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  };

  // Dữ liệu tin nhắn cho phòng chat được chọn
  const selectedChat = chats.ongoing.find(
    (chat) => chat.roomId === selectedRoomId
  );
  const messages = selectedChat
    ? [
        {
          sender:
            selectedChat.lastMessage.senderType === "CUSTOMER"
              ? "Customer"
              : "You",
          text: selectedChat.lastMessage.content,
          time: formatTime(selectedChat.lastMessage.timestamp),
          isSent: selectedChat.lastMessage.senderType !== "CUSTOMER",
        },
      ]
    : [];

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
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => setSelectedRoomId(chat.roomId)}
              >
                <Avatar>
                  <AvatarImage src="" alt={chat.otherParticipant.userId} />
                  <AvatarFallback>
                    {chat.otherParticipant.userType[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {chat.otherParticipant.userType}
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
                      <Badge className="bg-danger-500 text-white">1</Badge>
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
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                onClick={() => setSelectedRoomId(chat.roomId)}
              >
                <Avatar>
                  <AvatarImage src="" alt={chat.otherParticipant.userId} />
                  <AvatarFallback>
                    {chat.otherParticipant.userType[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {chat.otherParticipant.userType}
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
                src=""
                alt={selectedChat?.otherParticipant.userType || "User"}
              />
              <AvatarFallback>
                {selectedChat?.otherParticipant.userType[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">
                {selectedChat?.otherParticipant.userType || "User"}
              </h2>
              <p className="text-sm text-gray-500">
                Online - Last seen,{" "}
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
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.isSent ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.isSent
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.isSent ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {msg.time}
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
            className="flex-1"
          />
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Camera className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-primary">
            <Mic className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
