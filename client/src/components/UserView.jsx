import React from "react";
import Avatars from "./Avatars";
import { FaCopy } from "react-icons/fa";
import CopyText from "./CopyText";
import "../styles/Lobby.css";

const UserView = ({
    copyMessage
}) => {
  const users = [
    { id: 1, username: "Rohit Chouhan" },
    { id: 2, username: "Siddharth Gohil" },
  ];
  
  return (
    <>
        <div className="user-view">
        <CopyText copyMessage={copyMessage} />
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
