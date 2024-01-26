import React, { useState, useEffect, useRef } from "react";
import StompConnection from "../config/Config.jsx";
import MessageViewComponent from "./MessageViewComponent";
import CopyText from "./CopyText.jsx";
import Utilities from "../utilities/Utilities";
import "../styles/PrivateChatBox.css";

const PrivateChatBox = () => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [stompConnection, setStompConnection] = useState(null);
  const [userID, setUserID] = useState("");
  const [subscribeFlag, setSubscribeFlag] = useState(false);
  const [chatSessionID, setChatSessionID] = useState("");
  const [shouldConnectForChat, setShouldConnectForChat] = useState(false);

  useEffect(() => {
    console.log("Initialize stomp connection...");
    const userUUID = Utilities.getUniqueID();
    setUserID(userUUID);
    const connection = new StompConnection(
      // "wss://catchup-media-server.onrender.com/meet",
      "wss://catchup-media-server-beta.onrender.com/meet",
      // "ws://localhost:8080/meet",
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
      // subscriptionHandler();
      // subscribeToPrivateRoom();
    }
  }, [subscribeFlag]);

  useEffect(() => {
    if (shouldConnectForChat) {
      subscribeToPrivateRoom();
    }
  }, [shouldConnectForChat]);

  const handleStartConvoButton = () => {
    setShouldConnectForChat(true);
  }

  const subscribeToPrivateRoom = () => {
    // Replace "private-room-id" with the actual private room ID
    const privateRoomID = "private-room-id";
    const topic = `/user/${chatSessionID}/private`;
    // const topic = "/user/123" + "/private";
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

    // var newMessage = {
    //   userID: userID,
    //   type: "message",
    //   content: inputMessage,
    //   receiverID: "123",
    //   isPrivate: true,
    //   roomID: null,
    //   destination: null
    // };

    var newMessage = {
      userID: userID,
      type: "message",
      content: inputMessage,
      receiverID: chatSessionID, // Replace with the actual receiver ID
      isPrivate: true,
      roomID: "private-room-id", // Replace with the actual private room ID
      destination: null,
    };

    // stompConnection.publish("/app/room", JSON.stringify(newMessage));
    // stompConnection.publish(`/app/room/${newMessage.roomID}`, JSON.stringify(newMessage));
    stompConnection.publish("/app/private", JSON.stringify(newMessage));
    setInputMessage("");
  };

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleInputChangeForChatSessionID = (event) => {
    setChatSessionID(event.target.value);
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-page">
    <div>
      <CopyText copyMessage={userID} />
      <div className="chat-input-container">
          <input
            type="text"
            placeholder="Enter chatID and connect..."
            value={chatSessionID}
            onChange={handleInputChangeForChatSessionID}
          />
          <button className="send-button" onClick={handleStartConvoButton}>
            Connect
          </button>
        </div>
      </div>
      <div className="chat-container">
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
    </div>
  );
};

export default PrivateChatBox;
