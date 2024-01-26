import React, { useEffect, useState } from "react";
import UserView from "./UserView";
import ChatBox from "./ChatBox";
import ControlsView from "./ControlsView";
import { ChatProvider } from "../contexts/ChatContext";
import Utilities from "../utilities/Utilities";

import "../styles/Lobby.css";

const Lobby = ({ remoteRoomID }) => {
  const [isChatSectionOpen, setIsChatSectionOpen] = useState(false);
  const [lobbyID, setLobbyID] = useState(null);

  useEffect(() => {
    if(!remoteRoomID && !lobbyID) {
      console.log("remote room ID is: ", remoteRoomID);
      const randomUUID = Utilities.getUniqueID();
      setLobbyID(randomUUID);
      // save this ID so that only server generated ID's are allowed
    } else {
      console.log("You are joinig some room");
      setLobbyID(remoteRoomID);
    }
  }, []);
  

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
