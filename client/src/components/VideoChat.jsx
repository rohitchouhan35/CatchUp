import React, { useEffect, useRef, useState } from "react";
import StompConnection from "../config/Config.jsx";

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [stompConnection, setStompConnection] = useState(null);
  const [subscribeFlag, setSubscribeFlag] = useState(false);
  const [shouldStartCall, setShouldStartCall] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    console.log("Initialize stomp connection...");
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

  useEffect(() => {
    if (subscribeFlag) {
      subscriptionHandler();
    }
  }, [subscribeFlag]);

  function handleStompConnect(frame) {
    console.log("Entered onconnect");
    setSubscribeFlag(true);
  }

  function subscriptionHandler() {
    // stompConnection.subscribe("/signal/newAnswer", onNewAnswer);
    // stompConnection.subscribe("/signal/newIceCandidate", onNewIceCandidate);
    // stompConnection.subscribe("/signal/availableOffers", onAvailableOffers);
    stompConnection.subscribe("/signal/newOfferAwaiting", onNewOfferAwaiting);
    // stompConnection.subscribe("/signal/answerResponse", onAnswerResponse);
    // stompConnection.subscribe("/signal/receivedIceCandidateFromServer", onReceivedIceCandidateFromServer);
    if(shouldStartCall) {
      call();
    }
  }

  const onNewOfferAwaiting = (offer) => {
    try {
      var offerData = JSON.parse(offer.body);
      console.log("Message received from -- onNewOfferAwaiting -- ", offerData);
    } catch (error) {
      console.error("Error in receiving message from -- onNewOfferAwaiting -- ", error);
    }
  }

  const call = async () => {
    await fetchUserMedia();
    // await createPeerConnection();

    const testOffer = {
      offererUserName: "Rohit",
      offer: null,
      offerIceCandidates: null,
      answererUserName: null,
      answer: null,
      answererIceCandidates: null
    }

    stompConnection.publish("/app/newOffer", JSON.stringify(testOffer));
  };

  const fetchUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline controls />
      <video ref={remoteVideoRef} autoPlay playsInline controls />
      <button id="call">Call</button>
      <div id="answer" className="col"></div>
    </div>
  );
};

export default VideoChat;
