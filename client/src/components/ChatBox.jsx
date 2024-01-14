import React, { useState, useEffect, useRef } from "react";
import MessageViewComponent from "./MessageViewComponent";
import { v4 as uuidv4 } from 'uuid';
import "../styles/Lobby.css";

const ChatBox = ({
    userID, messages, setMessages, handlePublishMessage, handleReceivedMessage
}) => {

    const [inputMessage, setInputMessage] = useState("");
    const messagesContainerRef = useRef(null);

    const handleMessageSend = () => {
        if (inputMessage.trim() === "") {
          return;
        }

        var newMessage = {
          userID: userID,
          type: "message",
          content: inputMessage,
          receiverID: null,
          isPrivate: null,
          roomID: null,
          destination: null
        };

        console.log("sending message from chatbox")

        handlePublishMessage("/room/messages", JSON.stringify(newMessage));
        setInputMessage("");
      };
    
      const handleInputChange = (event) => {
        setInputMessage(event.target.value);
      };

      useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, [messages]);

  return (
    <div className="chat-container">
      <p className="message-section-info">
        These messages are visible to everyone
      </p>
      <div ref={messagesContainerRef} className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            {message.type === "message" && (
              <MessageViewComponent message={message.content} mine={message.userID === userID} />
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
