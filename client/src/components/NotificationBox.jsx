import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../styles/NotificationBox.css";

const NotificationBox = ({ message, timeInSeconds, position }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay the appearance for a smoother sliding effect

    const timeForFadeOut = timeInSeconds || 4;
    position = position || "top-center";

    const timeoutId = setTimeout(() => {
      setIsVisible(false);
    }, timeForFadeOut * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeInSeconds]);

  return (
    <div>
      <div
        className={`notification-container ${position} ${isVisible ? "visible" : "hidden"}`}
      >
        <div className="notification-box">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

NotificationBox.propTypes = {
  message: PropTypes.string.isRequired,
  timeInSeconds: PropTypes.number.isRequired,
  position: PropTypes.oneOf([
    "top-right",
    "top-left",
    "bottom-right",
    "bottom-left",
    "top-center",
  ]).isRequired,
};

export default NotificationBox;
