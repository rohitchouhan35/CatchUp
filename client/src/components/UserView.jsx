import React from "react";
import Avatars from "./Avatars";
import { FaCopy } from "react-icons/fa";
import CopyText from "./CopyText";
import "../styles/Lobby.css";

const UserView = ({ copyMessage }) => {
  const users = [
    { id: 1, username: "Rohit Chouhan" },
    { id: 2, username: "Siddharth Gohil" },
  ];

  // use useEffect to mimic call to start application
  // don't wait for answer connect immediately

  

  return (
    <>
      <div className="user-view">
        <CopyText copyMessage={copyMessage} />
        <div className="video-container">
          {/* {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="random-avatar">
                <Avatars />
              </div>
              <p>{user.username}</p>
            </div>
          ))} */}

          <video class="video-player user-card" id="local-video" autoplay playsinline controls>
              <div className="random-avatar">
                <Avatars />
              </div>
          </video>
          <video class="video-player user-card" id="remote-video" autoplay playsinline controls>
              <div className="random-avatar">
                <Avatars />
              </div>
          </video>
        </div>
      </div>
    </>
  );
};

export default UserView;
