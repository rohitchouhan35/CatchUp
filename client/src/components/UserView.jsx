import React from "react";
import Avatars from "./Avatars";
import { FaCopy } from "react-icons/fa";
import "../styles/Lobby.css";

const UserView = ({
    copyMessage
}) => {
  const users = [
    { id: 1, username: "Rohit Chouhan" },
    { id: 2, username: "Siddharth Gohil" },
  ];

  const handleCopyClick = () => {
    navigator.clipboard.writeText(copyMessage);
    alert("Room ID copied to clipboard!");
  };

  return (
    <>
        <div className="user-view">
        <div className="helper">
          <div className="message-container">
            <div className="message-text">{copyMessage}</div>
            <div onClick={handleCopyClick} className="copy-icon">
                <FaCopy />
            </div>
          </div>
          {/* <div className="below-text">Copy and Share</div> */}
        </div>
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
    </>
  );
};

export default UserView;
