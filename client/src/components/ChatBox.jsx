import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../contexts/ChatContext.jsx";
import StompConnection from "../config/Config.jsx";
import MessageViewComponent from "./MessageViewComponent";
import Utilities from "../utilities/Utilities";
import "../styles/Lobby.css";

const ChatBox = ({ chatSessionID }) => {
  const { isChatSectionOpen } = useChat();
  const [inputMessage, setInputMessage] = useState("");
  const messagesContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [stompConnection, setStompConnection] = useState(null);
  const [userID, setUserID] = useState("");
  const [subscribeFlag, setSubscribeFlag] = useState(false);

  useEffect(() => {
    console.log("ChatBox initialize stomp connection...");
    const userUUID = Utilities.generateUUID();
    setUserID(userUUID);
    const connection = new StompConnection(
      // "wss://catchup-media-server.onrender.com/meet",
      // "wss://catchup-media-server-beta.onrender.com/meet",
      "ws://localhost:8080/meet",
      handleStompConnect
    );
    setStompConnection(connection);
    connection.activate();

    return () => {
      console.log("Cleanup stomp connection...");
      connection.deactivate();
    };
  }, []);

  function handleStompConnect(frame) {
    console.log("Connected to server");
    setSubscribeFlag(true);
  }

  useEffect(() => {
    if (subscribeFlag) {
      subscribeToPrivateRoom();
    }
  }, [subscribeFlag]);

  const subscribeToPrivateRoom = () => {
    const topic = `/user/${chatSessionID}/private`;
    stompConnection.subscribe(topic, onPrivateRoomMessageReceived);
  };

  const onPrivateRoomMessageReceived = (message) => {
    try {
      console.log("Message received from private room.");
      var messageData = JSON.parse(message.body);
      console.log(messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    } catch (error) {
      console.error("Error in receiving message from private room:", error);
    }
  };

  const handleMessageSend = () => {
    if (inputMessage.trim() === "") {
      return;
    }

    var newMessage = {
      userID: userID,
      type: "message",
      content: inputMessage,
      receiverID: chatSessionID,
      isPrivate: true,
      roomID: "private-room-id",
      destination: null,
    };

    console.log("sending message from chatbox");

    stompConnection.publish("/app/private", JSON.stringify(newMessage));
    setInputMessage("");
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if(!isChatSectionOpen) {
    return null;
  }

  return (
    <div className="chat-container">
      <p className="message-section-info">
        These messages are visible to everyone
      </p>
      <div ref={messagesContainerRef} className="chat-messages">
        {messages &&
          messages.map((message) => (
            <div key={message.id} className="message">
              {message.type === "message" && (
                <MessageViewComponent
                  message={message.content}
                  mine={message.userID === userID}
                />
              )}
            </div>
          ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputChange}
        />
        <button className="send-button" onClick={handleMessageSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
