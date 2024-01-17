import React, { useState, useEffect, useRef } from "react";
import StompConnection from "../config/Config.jsx";
import MessageViewComponent from "./MessageViewComponent";
import Utilities from "../utilities/Utilities";
import "../styles/Lobby.css";

const PrivateChatBox = () => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [stompConnection, setStompConnection] = useState(null);
  const [userID, setUserID] = useState("");
  const [subscribeFlag, setSubscribeFlag] = useState(false);

  useEffect(() => {
    console.log("Initialize stomp connection...");
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
      subscriptionHandler();
    }
  }, [subscribeFlag]);

  const subscriptionHandler = () => {
    const topicEndpoint = "/room/messages";
    stompConnection.subscribe(topicEndpoint, onMessageReceived);
  };

  const onMessageReceived = (message) => {
    try {
      console.log("messaged received from private party.");
      var messageData = JSON.parse(message.body);
      console.log(messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    } catch (error) {
      console.error("Error in reveiving message from private party:", error);
    }
  };

  const handleMessageSend = () => {
    if (inputMessage.trim() === "") {
      return;
    }

    console.log("sending message to private party.");

    var newMessage = {
      userID: userID,
      type: "message",
      content: inputMessage,
      receiverID: "123",
      isPrivate: true,
      roomID: null,
      destination: null
    };

    stompConnection.publish("/app/room", JSON.stringify(newMessage))
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

  return (
    <div className="chat-container" style={{ "width": "80%", "margin": "auto" }}>
      <p className="message-section-info">
        No third party can see these messages
      </p>
      <div ref={messagesContainerRef} className="chat-messages">
        {messages &&
          messages.map((message, index) => (
            <div key={index} className="message">
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

export default PrivateChatBox;
