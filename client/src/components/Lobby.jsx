import React, { useState } from "react";
import {
  FaVideo,
  FaMicrophone,
  FaLaptop,
  FaRocketchat,
  FaPhoneAlt,
} from "react-icons/fa";
import Avatars from "./Avatars";
import { v4 as uuidv4 } from 'uuid';

import "../styles/Lobby.css";

const users = [
  { id: 1, username: "Rohit Chouhan" },
  { id: 2, username: "Siddharth Gohil" },
];

const Lobby = () => {
  const [isChatSectionOPen, setIsChatSectionOPen] = useState(false);

  const hadnleChatButtonClick = () => {
    setIsChatSectionOPen(!isChatSectionOPen);
  }
  return (
    <div className="lobby">
      <div className="lobby-container">
        <div className="video-container">
          {users.map((user) => (
            <div key={user.id} className="user-card">
            <div className="random-avatar">
              <Avatars />
            </div>
              <p>{user.username}</p>
            </div>
          ))}
        </div>
        {isChatSectionOPen && (
          <div className="chat-container">
          <p class="message-section-info">These messages are visible to everyone</p>
            <div className="chat-messages">
              {/* Chat messages go here */}
              <div className="message">
                {/* <span className="username">Rohit:</span> Hello! */}
              </div>
              {/* Add more messages as needed */}
            </div>
            <div className="chat-input-container">
              <input type="text" placeholder="Type your message..." />
              <button className="send-button">Send</button>
            </div>
          </div>
        )}
      </div>
      <div className="control-container">
        <button className="control-btn">
          <FaMicrophone />
        </button>
        <button className="control-btn">
          <FaVideo />
        </button>
        <button className="control-btn">
          <FaLaptop />
        </button>
        <button className="control-btn" onClick={hadnleChatButtonClick}>
          <FaRocketchat />
        </button>
        <button className="control-btn control-btn-cut">
          <FaPhoneAlt />
        </button>
      </div>
    </div>
  );
};

export default Lobby;
