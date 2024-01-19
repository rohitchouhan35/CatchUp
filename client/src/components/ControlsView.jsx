import React from "react";
import { FaVideo, FaMicrophone, FaLaptop, FaRocketchat, FaPhoneAlt } from "react-icons/fa";
import { useChat } from "../contexts/ChatContext";

const ControlsView = () => {

  const { toggleChatSection } = useChat();

  return (
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
      <button className="control-btn" onClick={toggleChatSection}>
        <FaRocketchat />
      </button>
      <button className="control-btn control-btn-cut">
        <FaPhoneAlt />
      </button>
    </div>
  );
};

export default ControlsView;
