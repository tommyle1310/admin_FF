"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const DashboardCustomerCare = () => {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("This Week");

  // Sample ticket data
  const tickets = [
    {
      id: "2023-CS123",
      title: "How to deposit money to my portal?",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      status: "New",
      priority: "Low",
      user: "John Snow",
      time: "12:45 AM",
    },
    {
      id: "2023-CS123",
      title: "How to deposit money to my portal?",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      status: "On-Going",
      priority: "High",
      user: "John Snow",
      time: "12:45 AM",
    },
    {
      id: "2023-CS123",
      title: "How to deposit money to my portal?",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      status: "Resolved",
      priority: "Low",
      user: "John Snow",
      time: "12:45 AM",
    },
  ];

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500";
      case "On-Going":
        return "bg-orange-400";
      case "Resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <Input
          placeholder="Search for ticket"
          className="w-1/3 bg-white border"
        />
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40 bg-white border">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="New Tickets">New Tickets</SelectItem>
            <SelectItem value="On-Going Tickets">On-Going Tickets</SelectItem>
            <SelectItem value="Resolved Tickets">Resolved Tickets</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-32 bg-white border">
            <SelectValue placeholder="This Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="Last Week">Last Week</SelectItem>
            <SelectItem value="This Month">This Month</SelectItem>
          </SelectContent>
        </Select>
        <Button>New Ticket</Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="All Tickets" className="mb-4">
        <TabsList>
          <TabsTrigger value="All Tickets">All Tickets</TabsTrigger>
          <TabsTrigger value="New">New</TabsTrigger>
          <TabsTrigger value="On-Going">On-Going</TabsTrigger>
          <TabsTrigger value="Resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <Card
            key={index}
            className={`border ${
              ticket.priority === "High" ? "border-blue-500 border-2" : ""
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-4 h-4 rounded-full ${getStatusColor(
                    ticket.status
                  )}`}
                ></div>
                <CardTitle className="text-sm font-medium">
                  Ticket#{ticket.id}
                </CardTitle>
                {ticket.priority === "High" && (
                  <Badge className={getPriorityColor(ticket.priority)}>
                    High Priority
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-500">
                Posted at {ticket.time}
              </span>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">{ticket.title}</h3>
              <p className="text-sm text-gray-600">{ticket.description}</p>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src="" alt={ticket.user} />
                    <AvatarFallback>{ticket.user[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ticket.user}</span>
                </div>
                <Button variant="outline">Open Ticket</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <Button variant="outline">Previous</Button>
        <Button variant="outline" className=" text-white bg-primary">
          1
        </Button>
        <Button variant="outline">2</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
};

export default DashboardCustomerCare;
