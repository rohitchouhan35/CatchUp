import React, { useEffect, useState } from "react";
import UserView from "./UserView";
import ChatBox from "./ChatBox";
import ControlsView from "./ControlsView";
import { ChatProvider } from "../contexts/ChatContext";
import { VideoChatProvider } from "../contexts/VideoChatContext";

import Utilities from "../utilities/Utilities";
import NotificationBox from "./NotificationBox";
import "../styles/Lobby.css";

const Lobby = ({ remoteRoomID, userID }) => {
  const [isChatSectionOpen, setIsChatSectionOpen] = useState(false);
  const [lobbyID, setLobbyID] = useState(null);

  useEffect(() => {
    const fetchLobbyId = async () => {
      try {
        // debugger;
        if (!remoteRoomID && !lobbyID) {
          console.log("remote room ID is: ", remoteRoomID);
          const randomUUID = await Utilities.getUniqueID();
          setLobbyID(randomUUID);
        } else {
          console.log("You are joinig some room");
          setLobbyID(remoteRoomID);
        }
      } catch (error) {
        console.error("Error initializing Stomp connection:", error);
      }
    };

    fetchLobbyId();
  }, []);

  const handleChatButtonClick = () => {
    setIsChatSectionOpen(!isChatSectionOpen);
  };

  return (
    <VideoChatProvider>
      <ChatProvider>
        <div className="lobby">
          <div className="lobby-container">
          <NotificationBox message="You joined the room!" timeInSeconds={3} position="top-right"/>
            <UserView copyMessage={lobbyID} userID={userID} />
            <ChatBox chatSessionID={lobbyID} userID={userID} />
          </div>
          <ControlsView handleChatButtonClick={handleChatButtonClick} />

        </div>
      </ChatProvider>
    </VideoChatProvider>
  );
};

export default Lobby;
