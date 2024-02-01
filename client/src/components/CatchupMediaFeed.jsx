import React, { useState, useEffect } from "react";
import StompConnection from "../config/Config.jsx";
import "../styles/Lobby.css";

const CatchUpMediaFeed = () => {
  const [dataURL, setDataURL] = useState(null);
  const [stompConnection, setStompConnection] = useState(null);
  const [subscribeFlag, setSubscribeFlag] = useState(false);

  useEffect(() => {
    const connection = new StompConnection(
      // "https://catchup-media-server-test.onrender.com/",
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
      subscribeToMediaFeedEndpoint();
    }
  }, [subscribeFlag]);

  const subscribeToMediaFeedEndpoint = () => {
    const topic = "/media/live-feed";
    stompConnection.subscribe(topic, onMediaFeedReceived);
  };

  const onMediaFeedReceived = (frame) => {
    try {
      // console.log(frame.body);
      // Assuming frame.body is a base64-encoded image string
      const base64String = frame.body;
  
      // Set the base64 string as the source of the image element
      document.getElementById('videoFrame').src = `data:image/webp;base64,${base64String}`;
    } catch (error) {
      console.error("Error in receiving frame from media server: ", error);
    }
  };

  return (
    <div>
      <h1>Live Video Stream</h1>
      <img id="videoFrame" alt="Video Frame" src={dataURL} />
    </div>
  );
};

export default CatchUpMediaFeed;
