//import { useState } from "react";
//import { sendMessageToBot } from "@/api/chatbot";
//
//export function useBotMessage() {
//  const [loading, setLoading] = useState<boolean>(false);
//  const [error, setError] = useState<string | null>(null);
//
//  const sendMessage = async (text: string): Promise<string> => {
//    setLoading(true);
//    setError(null);
//
//    try {
//      const reply = await sendMessageToBot(text);
//      return reply;
//    } catch (err: any) {
//      setError(err.message || "Unknown error");
//      return "Sorry, something went wrong.";
//    } finally {
//      setLoading(false);
//    }
//  };
//
//  return { sendMessage, loading, error };
//}
// hooks/useBotMessage.ts
import { useState } from "react";

export const useBotMessage = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (userText: string) => {
    setLoading(true);
    // Simulate backend call
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    return "¡Mensaje recibido!";
  };

  return { sendMessage, loading };
};
