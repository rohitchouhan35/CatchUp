import React, { createContext, useContext, useState, useEffect } from "react";
import StompConnection from "../config/Config";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [stompConnection, setStompConnection] = useState(null);

  useEffect(() => {
    const connection = new StompConnection("ws://localhost:8080/meet");
    setStompConnection(connection);

    return () => {
      console.log("Cleanup stomp connection...");
      connection.deactivate();
    };
  }, []);

  const activateConnection = (callback) => {
    if (stompConnection) {
      stompConnection.activate(callback);
    }
  };

  const deactivateConnection = () => {
    if (stompConnection) {
      stompConnection.deactivate();
    }
  };

  const publish = (destination, message) => {
    if (stompConnection) {
      stompConnection.publish(destination, message);
    }
  };

  const subscribe = (destination, callback) => {
    if (stompConnection) {
      stompConnection.subscribe(destination, callback);
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        stompConnection,
        activateConnection,
        deactivateConnection,
        publish,
        subscribe,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

// import React, { useState, useEffect, useRef } from "react";
// import { useWebSocket } from "../path-to-your-WebSocketContext";
// import MessageViewComponent from "./MessageViewComponent";
// import Utilities from "../utilities/Utilities";
// import "../styles/Lobby.css";

// const ChatBox = ({ chatSessionID }) => {
//   const [inputMessage, setInputMessage] = useState("");
//   const messagesContainerRef = useRef(null);
//   const [messages, setMessages] = useState([]);
//   const { stompConnection, activateConnection, subscribe, publish } =
//     useWebSocket();
//   const [userID, setUserID] = useState("");

//   useEffect(() => {
//     console.log("ChatBox initialize stomp connection...");
//     const userUUID = Utilities.generateUUID();
//     setUserID(userUUID);

//     activateConnection(handleStompConnect);

//     return () => {
//       console.log("Cleanup stomp connection...");
//       stompConnection.deactivate();
//     };
//   }, [stompConnection, activateConnection]);

//   // ... rest of your component

//   const subscribeToPrivateRoom = () => {
//     const topic = `/user/${chatSessionID}/private`;
//     subscribe(topic, onPrivateRoomMessageReceived);
//   };

//   const handleMessageSend = () => {
//     if (inputMessage.trim() === "") {
//       return;
//     }

//     var newMessage = {
//       userID: userID,
//       type: "message",
//       content: inputMessage,
//       receiverID: chatSessionID,
//       isPrivate: true,
//       roomID: "private-room-id",
//       destination: null,
//     };

//     console.log("sending message from chatbox");

//     publish("/app/private", JSON.stringify(newMessage));
//     setInputMessage("");
//   };

//   // ... rest of your component
// };

// const handleStompConnect = (frame) => {
//   console.log("Connected to server");
//   // Additional logic you want to execute when the connection is established
//   // For example, setting state or triggering other actions
//   // In this case, it sets the subscribeFlag to true
//   setSubscribeFlag(true);
// };
