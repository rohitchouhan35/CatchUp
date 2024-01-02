import React, { useState } from "react";
import {
  FaVideo,
  FaMicrophone,
  FaLaptop,
  FaRocketchat,
  FaPhoneAlt,
} from "react-icons/fa";
import Avatars from "./Avatars";

import "../styles/Lobby.css";

const users = [
  { id: 1, username: "Rohit Chouhan" },
  { id: 2, username: "Siddharth Gohil" },
];

const Lobby = () => {
  const [isChatSectionOPen, setIsChatSectionOPen] = useState(true);
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
        <button className="control-btn">
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
