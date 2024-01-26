// ChatContext.jsx
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isChatSectionOpen, setIsChatSectionOpen] = useState(false);

  const toggleChatSection = () => {
    setIsChatSectionOpen((prev) => !prev);
    console.log("toggled: ", isChatSectionOpen);
  };

  return (
    <ChatContext.Provider value={{ isChatSectionOpen, toggleChatSection }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
