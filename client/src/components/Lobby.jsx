import React, { useEffect, useState } from "react";
import UserView from "./UserView";
import ChatBox from "./ChatBox";
import ControlsView from "./ControlsView";

import "../styles/Lobby.css";

// const Lobby = ({
//   stompConnection,
//   handleSubscription,
//   handlePublishMessage,
//   subscriptions,
//   receivedMessages,
//   userID,
// }) 

const Lobby = ({
  userID, messages, setMessages, handlePublishMessage, handleReceivedMessage
}) => {
  const [isChatSectionOpen, setIsChatSectionOpen] = useState(false);
  const [currRoomIDOfLobby, setCurrRoomIDOfLobby] = useState("65sdfsdf55-sdfd-fsdfsdfdsf");

  const handleChatButtonClick = () => {
    setIsChatSectionOpen(!isChatSectionOpen);
  };

  return (
    <div className="lobby">
      <div className="lobby-container">
        <UserView copyMessage={currRoomIDOfLobby} />
        {isChatSectionOpen && <ChatBox userID={userID} messages={messages} setMessages={setMessages} handlePublishMessage={handlePublishMessage} handleReceivedMessage={handleReceivedMessage}/>}
      </div>
      <ControlsView handleChatButtonClick={handleChatButtonClick} />
    </div>
  );
};

export default Lobby;
