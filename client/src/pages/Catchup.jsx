import React, { useEffect, useState } from "react";
import StompConnection from "../config/Config.jsx";
import Utilities from "../utilities/Utilities";
import ConnectingPageComponent from "../components/ConnectingPageComponent";
import "../styles/Catchup.css";

const Catchup = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stompConnection, setStompConnection] = useState(null);
  const [subscribeFlag, setSubscribeFlag] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [isOfferReady, setIsOfferReady] = useState(false);
  const [isClientReady, setIsClientReady] = useState(false);
  const [currentRoomID, setCurrentRoomID] = useState("");
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const userUUID = Utilities.generateUUID();
    setUserID(userUUID);
    console.log(userUUID);
    console.log("Initialize stomp connection...");

    const connection = new StompConnection(
      "wss://catchup-media-server.onrender.com/meet",
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

  useEffect(() => {
    if (isOfferReady && isClientReady) {
      console.log("Preparing to send offer...");
      sendOfferToClient();
    } else {
      console.log("isOfferReady",isOfferReady);
      console.log("isClientReady",isClientReady);
      console.log("Either client or offer is not ready");
    }
  }, [isOfferReady, isClientReady]);

  function sendOfferToClient() {
    if (!isClientReady || !isOfferReady) return;
    stompConnection.publish("/app/application", offer);
  }

  function handleStompConnect(frame) {
    console.log("Entered onconnect");
    for (const topic of subscriptions) {
      const topicName = topic.name;
      console.log("Subscribing to topic ", topicName);
      stompConnection.subscribe(topicName, topic.onMessage);
    }
    setSubscribeFlag(true);
  }

  function handleSubscription(subscription) {
    stompConnection.subscribe(subscription.topic, subscription.onMessage);
    setSubscriptions([...subscriptions]);
  }

  function handlePublishMessage(destination, message) {
    console.log("Publishing message: ", message, "to destination:", destination);
    stompConnection.publish(destination, message);
  }

  const subscriptionHandler = () => {
    const lobbyTopic = "/all/messages";
    handleSubscription({
      topic: lobbyTopic,
      onMessage: (message) => {
        setReceivedMessages((prevMessages) => [...prevMessages, message.body]);
        const response = Utilities.parseJSON(message);

        if (response.userID === userID) {
          console.log("This is your message..");
        }

        if (response.userID !== userID && response.content === "readySignal") {
          setIsClientReady(true);
        }
      },
    });
  };

  // const handleSendMessage = () => {
  //   handlePublishMessage("/app/application", message);
  //   setMessage("");
  // };

  const handleStartMeeting = () => {
    const myRoomId = Utilities.generateUUID();
    setCurrentRoomID(myRoomId);

    var startMessage = {
      content: "offer",
      userID: userID,
      value: offer,
    };
    const jsonStringMessage = JSON.stringify(startMessage);
    setOffer(jsonStringMessage);

    setIsOfferReady(true);
  };

  const handleJoinMeeting = () => {
    if (currentRoomID !== "" && currentRoomID.length > 0) {
      // subscribe to this room
    } else {
      return;
    }

    var joinMessage = {
      content: "readySignal",
      userID: userID,
      value: null,
    };
    const jsonStringMessage = JSON.stringify(joinMessage);
    handlePublishMessage("/app/application", jsonStringMessage);
  };

  const handleRoomIDInputChange = (event) => {
    setCurrentRoomID(event.target.value);
  };

  if (!stompConnection) {
    return <ConnectingPageComponent />;
  }

  return (
    <div>
      <div className="meet-container">
        <div className="left-container">
          <div className="meeting-btn">
            <button className="blank-button" onClick={handleStartMeeting}>
              <span className="plus-sign">+ </span>Start Meeting
            </button>
            <div className="roomId-input-box">
              <input
                  type="text"
                  placeholder="Enter a code or link"
                  value={currentRoomID}
                  onChange={handleRoomIDInputChange}
                />
            </div>
            <div
              className="text-button"
              onClick={handleJoinMeeting}
              style={{
                color: currentRoomID.length > 0 ? "white" : "#757575",
                cursor: currentRoomID.length > 0 ? "pointer" : "not-allowed",
              }}
            >
              Join
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catchup;
