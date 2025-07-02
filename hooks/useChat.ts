import { sendMessageToBot } from "@/api/chatbot";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { getUserId } from "@/api/userId";
import { useUserLocation } from "@/hooks/useUserLocation";
import { ChatInfo } from "@/constants/mocks/mockTypes";

export const useBotMessage = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { location: userLocation } = useUserLocation(4000);

  const sendMessage = async (userText: string) => {
    if (!token){
      throw new Error("Token not available");
    }

    if (!userLocation) {
      throw new Error("Location not available");
    }

    setLoading(true);

    try {
      const userId = await getUserId(token);
      const chatInfo: ChatInfo = {
        userId,
        userMessage: userText,
        location_x: userLocation.x,
        location_y: userLocation.y,
      };
      console.log("ChanInfo: ",chatInfo)
      const reply = await sendMessageToBot(chatInfo);
      return reply;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

