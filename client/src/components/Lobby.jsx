import React, { useEffect, useState } from "react";
import UserView from "./UserView";
import ChatBox from "./ChatBox";
import ControlsView from "./ControlsView";
import { ChatProvider } from "../contexts/ChatContext";

import "../styles/Lobby.css";

const Lobby = () => {
  const [isChatSectionOpen, setIsChatSectionOpen] = useState(false);
  const [lobbyID, setLobbyID] = useState("65sdfsdf55-sdfd-fsdfsdfdsf");

  const handleChatButtonClick = () => {
    setIsChatSectionOpen(!isChatSectionOpen);
  };

  return (
    <ChatProvider>
      <div className="lobby">
        <div className="lobby-container">
          <UserView copyMessage={lobbyID} />
          <ChatBox chatSessionID={lobbyID}/>
        </div>
        <ControlsView handleChatButtonClick={handleChatButtonClick} />
      </div>
    </ChatProvider>
  );
};

export default Lobby;
