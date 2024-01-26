import React from "react";
import { FaCopy } from "react-icons/fa";

const CopyText = ({ copyMessage }) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(copyMessage);
    alert("Room ID copied to clipboard!");
  };

  return (
    <div>
      <div className="helper">
        <div className="message-container">
          <div className="message-text">{copyMessage}</div>
          <div onClick={handleCopyClick} className="copy-icon">
            <FaCopy />
          </div>
        </div>
        {/* <div className="below-text">Copy and Share</div> */}
      </div>
    </div>
  );
};

export default CopyText;
