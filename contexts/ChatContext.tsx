import React, { createContext, useContext, useState } from "react";

export type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

type ChatContextType = {
  messages: Message[];
  addMessage: (msg: Message) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("ChatContext not found");
  return context;
};
