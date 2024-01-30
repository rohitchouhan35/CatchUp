import React, { useEffect, useState } from "react";
import StompConnection from "../config/Config.jsx";
import Lobby from "../components/Lobby.jsx";
import Utilities from "../utilities/Utilities";
import ConnectingPageComponent from "../components/ConnectingPageComponent";
import "../styles/Catchup.css";

const Catchup = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stompConnection, setStompConnection] = useState(null);
  const [subscribeFlag, setSubscribeFlag] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentRoomID, setCurrentRoomID] = useState("");
  const [remoteRoomID, setRemoteRoomID] = useState("");
  const [userID, setUserID] = useState(null);
  const [amIOnline, setAmIOnline] = useState(false);
  const [launchRoom, setLaunchRoom] = useState(false);

  useEffect(() => {
    // const userUUID = Utilities.getUniqueID();
    // setUserID(userUUID);
    // console.log(userUUID);
    
    const fetchUserId = async () => {
      try {
        // debugger;
        const userUUID = await Utilities.getUniqueID();
        setUserID(userUUID);
        console.log(userUUID);
      } catch (error) {
        console.error("Error initializing Stomp connection:", error);
      }
    };
    
    fetchUserId();
    console.log("Initialize stomp connection...");

    const connection = new StompConnection(
      // "wss://catchup-media-server.onrender.com/meet",
      // "ws://localhost:8080/meet",
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

  useEffect(() => {
    if (amIOnline) {
      setLaunchRoom(true);
    }
  }, [amIOnline]);


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

    const lobbyTopicForConnectionCheck = "/connection/check";
    handleSubscription({
      topic: lobbyTopicForConnectionCheck,
      onMessage: (message) => {
        const response = Utilities.parseJSON(message);

        console.log("message from connection check: ", response);

        if (response.userID == userID) {
          console.log("This is your message..");
          setAmIOnline(true);
        }
      },
    });
  };

  const handleReceivedMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    console.log('Received message in parent:', message);
  };

  const handleStartMeeting = () => {
    // const myRoomId = Utilities.getUniqueID();
    // setCurrentRoomID(myRoomId);

    const fetchMyRoomId = async () => {
      try {
        // debugger;
          const myRoomId = await Utilities.getUniqueID();
          setCurrentRoomID(myRoomId);
      } catch (error) {
        console.error("Error initializing Stomp connection:", error);
      }
    };

    fetchMyRoomId();

    var connectionCheckMessage = {
      userID: userID,
      type: "connectionCheck"
    };
    const jsonStringMessage = JSON.stringify(connectionCheckMessage);
    handlePublishMessage("/app/connection", jsonStringMessage);
  };

  const handleJoinMeeting = () => {
    if (remoteRoomID !== "" && remoteRoomID.length > 0) {
      
      console.log("You are joining to a room");
      // actually check for online presence and other stuff as well
      setAmIOnline(true);

    } else {
      return;
    }

    var joinMessage = {
      userID: userID,
      type: "readySignal",
      content: null,
      receiverID: null,
      isPrivate: null,
      roomID: null,
      destination: null
    };
    const jsonStringMessage = JSON.stringify(joinMessage);
    handlePublishMessage("/app/room", jsonStringMessage);
  };

  const handleRoomIDInputChange = (event) => {
    setRemoteRoomID(event.target.value);
  };

  if (!subscribeFlag) {
    return <ConnectingPageComponent />;
  }

  if(launchRoom) {
    return <Lobby remoteRoomID={remoteRoomID} userID={userID} />;
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
                  value={remoteRoomID}
                  onChange={handleRoomIDInputChange}
                />
            </div>
            <div
              className="text-button"
              onClick={handleJoinMeeting}
              style={{
                color: remoteRoomID.length > 0 ? "white" : "#757575",
                cursor: remoteRoomID.length > 0 ? "pointer" : "not-allowed",
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
