// VideoChatContext.jsx
import React, { createContext, useContext, useState } from "react";

const VideoChatContext = createContext();

export const VideoChatProvider = ({ children }) => {
  const [isChatSectionOpen, setIsChatSectionOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLive, setIsLive] = useState(true);

  const toggleChatSection = () => {
    setIsChatSectionOpen((prev) => !prev);
    console.log("toggled chat: ", isChatSectionOpen);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    console.log("toggled mute: ", isMuted);
  };

  const toggleVideo = () => {
    setIsLive((prev) => !prev);
    console.log("toggled video: ", isLive);
  };

  return (
    <VideoChatContext.Provider value={{ isMuted, toggleMute, isLive, toggleVideo }}>
      {children}
    </VideoChatContext.Provider>
  );
};

export const useVideoChat = () => {
  return useContext(VideoChatContext);
};
