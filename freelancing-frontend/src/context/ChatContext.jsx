import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  // Structure: { [jobId]: [{ sender, text, timestamp }] }
  const [chats, setChats] = useState({});

  const sendMessage = (jobId, sender, text) => {
    setChats(prev => ({
      ...prev,
      [jobId]: [
        ...(prev[jobId] || []),
        { sender, text, timestamp: new Date().toLocaleString() }
      ]
    }));
  };

  return (
    <ChatContext.Provider value={{ chats, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
} 