import React, { useState, useEffect } from "react";
import StompConnection from "../config/Config.jsx";
import "../styles/Lobby.css";

const CatchUpMediaFeed = () => {
  const [dataURL, setDataURL] = useState(null);
  const [stompConnection, setStompConnection] = useState(null);
  const [subscribeFlag, setSubscribeFlag] = useState(false);
  const [videoSource, setVideoSource] = useState(null);

  useEffect(() => {
    const connection = new StompConnection(
      // "https://catchup-media-server-test.onrender.com/",
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
      subscribeToMediaFeedEndpoint();
    }
  }, [subscribeFlag]);

  const subscribeToMediaFeedEndpoint = () => {
    stompConnection.subscribe("/media/live-feed", onMediaFeedReceived);
    stompConnection.subscribe(
      "/media/live-feed-remote",
      onRemoteMediaFeedReceived
    );
    stompConnection.subscribe(
      "/media/live-binary-feed",
      onBinaryMediaFeedReceived
    );
  };

  const onMediaFeedReceived = (frame) => {
    try {
      // console.log(frame.body);
      // Assuming frame.body is a base64-encoded image string
      const base64String = frame.body;
      // console.log(frame.body);

      // Set the base64 string as the source of the image element
      document.getElementById(
        "videoFrame"
      ).src = `data:image/webp;base64,${base64String}`;
    } catch (error) {
      console.error("Error in receiving frame from media server: ", error);
    }
  };

  const onRemoteMediaFeedReceived = (frame) => {
    try {
      // console.log(frame.body);
      // Assuming frame.body is a base64-encoded image string
      console.log(frame.body);
      // const base64String = frame.body;

      // Set the base64 string as the source of the image element
      document.getElementById(
        "videoFrame"
      ).src = `data:image/webp;base64,${base64String}`;
    } catch (error) {
      console.error("Error in receiving frame from media server: ", error);
    }
  };

  const onBinaryMediaFeedReceived = (binaryFrame) => {
    try {
      // Assuming binaryFrame is a Blob
      let videoBlob = binaryFrame.body;

      console.log("blob is: ");
      console.log(videoBlob);

      // Directly access the payload without decoding
      const binaryData = videoBlob.payload;

      // Convert the binary data to a Uint8Array
      // const uint8Array = new Uint8Array(binaryData.length);
      // for (let i = 0; i < binaryData.length; i++) {
      //   uint8Array[i] = binaryData.charCodeAt(i);
      // }

      // Create a Blob from the Uint8Array
      // const blob = new Blob([uint8Array], { type: videoBlob.headers.contentType.toString() });

      // Create object URL from Blob
      const videoObjectURL = URL.createObjectURL(binaryData);

      // Set the object URL as the source for the video element
      setVideoSource(videoObjectURL);
    } catch (error) {
      console.error(
        "Error in receiving binary frame from media server: ",
        error
      );
    }
  };

  return (
    <div className="">
      <h1>Live Video Stream</h1>
      <div className="video-playback">
        <div className="local-video-playback">
          <img id="videoFrame" alt="Video Frame" src={dataURL} />
        </div>
        <div className="remote-video-playback">
          <img id="videoFrame" alt="Video Frame" src={dataURL} />
        </div>
      </div>
      {/* {videoSource && <video controls autoPlay src={videoSource} />} */}
    </div>
  );
};

export default CatchUpMediaFeed;
