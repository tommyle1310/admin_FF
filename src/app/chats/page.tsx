"use client";

import { useState } from "react";
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

export default function ChatPage() {
  const [message, setMessage] = useState("");

  // Sample data for groups and people
  const groups = [
    {
      name: "Friends Forever",
      message: "HAHAHAHA!",
      time: "Today, 9:52pm",
      unread: 4,
    },
    {
      name: "Mera Gang",
      message: "Kyuuuuu??",
      time: "Yesterday, 12:31pm",
      unread: 0,
    },
    {
      name: "Hiking",
      message: "It's not going to happen",
      time: "Wednesday, 9:12am",
      unread: 0,
    },
  ];

  const people = [
    {
      name: "Anil",
      message: "April fool's day",
      time: "Today, 9:52pm",
      unread: 0,
    },
    { name: "Chuthiya", message: "BAAAG", time: "Today, 12:11pm", unread: 1 },
    {
      name: "Mary ma’am",
      message: "You have to report it...",
      time: "Today, 2:40pm",
      unread: 1,
    },
    {
      name: "Bill Gates",
      message: "Nevermind bro",
      time: "Yesterday, 12:31pm",
      unread: 5,
    },
    {
      name: "Victoria H",
      message: "Okay, brother, let's see...",
      time: "Wednesday, 11:12am",
      unread: 0,
    },
  ];

  // Sample chat messages
  const messages = [
    {
      sender: "Anil",
      text: "Hey There!",
      time: "Today, 9:52pm",
      isSent: false,
    },
    {
      sender: "Anil",
      text: "How are you?",
      time: "Today, 9:52pm",
      isSent: false,
    },
    { sender: "You", text: "Hello!", time: "Today, 8:33pm", isSent: true },
    {
      sender: "You",
      text: "I am fine and how are you?",
      time: "Today, 8:34pm",
      isSent: true,
    },
    {
      sender: "Anil",
      text: "I am doing well, Can we meet tomorrow?",
      time: "Today, 8:36pm",
      isSent: false,
    },
    { sender: "You", text: "Yes Sure!", time: "Today, 8:58pm", isSent: true },
  ];

  return (
    <div className="flex ">
      {/* Sidebar */}
      <div className="w-1/3  border-r border-gray-200 gap-4 p-4">
        {/* Search Bar */}
        <Input placeholder="Search" className="mb-4 bg-white" />

        {/* Groups Section */}
        <div className="flex-col mb-4 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2 bg-white">Ongoing chats</h2>
          <div className="space-y-2">
            {groups.map((group, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
              >
                <Avatar>
                  <AvatarImage src="" alt={group.name} />
                  <AvatarFallback>{group.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{group.name}</span>
                    <span className="text-sm text-gray-500">{group.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {group.message}
                    </span>
                    {group.unread > 0 && (
                      <Badge className="bg-danger-500 text-white">
                        {group.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* People Section */}
        <div className="flex-col bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mt-4 mb-2 bg-white">
            Waiting list
          </h2>
          <div className="space-y-2">
            {people.map((person, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg"
              >
                <Avatar>
                  <AvatarImage src="" alt={person.name} />
                  <AvatarFallback>{person.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-sm text-gray-500">{person.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {person.message}
                    </span>
                    {person.unread > 0 && (
                      <Badge className="bg-danger-500 h-4 text-white">
                        {person.unread}
                      </Badge>
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
        <div className=" border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="" alt="Anil" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">Anil</h2>
              <p className="text-sm text-gray-500">
                Online - Last seen, 2:02pm
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
