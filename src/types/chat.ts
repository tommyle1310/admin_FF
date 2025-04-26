import { Avatar } from "./common";

export interface CustomerSender {
  id: string;
  first_name: string;
  last_name: string;
  avatar: Avatar | null;
}

export interface DriverSender {
  id: string;
  first_name: string;
  last_name: string;
  avatar: Avatar | null;
}

export interface RestaurantSender {
  id: string;
  restaurant_name: string;
  avatar: Avatar | null;
}

export interface CustomerCareSender {
  id: string;
  first_name: string;
  last_name: string;
  avatar: Avatar | null;
}

export interface Message {
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
  messages?: Message[];
}

export interface ChatRoom {
  roomId: string;
  type: string;
  otherParticipant: {
    userId: string;
    userType: string;
  };
  lastMessage: Message;
  lastActivity: string;
  relatedId: string | null;
  messages?: Message[];
}

export interface ChatResponse {
  ongoing: ChatRoom[];
  awaiting: ChatRoom[];
}
