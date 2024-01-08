import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { v4 as uuidv4 } from "uuid";
import ConnectingPageComponent from "../components/ConnectingPageComponent";
import "../styles/Catchup.css";

const Catchup = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [subscribeFlag, setSubscribeFlag] = useState(false);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [offer, setOffer] = useState(null);
  const [answer, setAnswer] = useState(null);
  let lastSDP = null;
  let lastAnswerSDP = null;

  // will be used to check if initiator is ready with offer
  const [isOfferReady, setIsOfferReady] = useState(false);

  // will be used to check condition for broadcasting it's offer to other user
  const [isClientReady, setIsClientReady] = useState(false);

  // id of current room (can be own or received)
  const [currentRoomID, setCurrentRoomID] = useState("");

  // identifies each user uniquely
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const userUUID = uuidv4();
    setUserID(userUUID);
    console.log(userUUID);
    console.log("Initialize stomp client...");
    const stompConfig = {
      // brokerURL: "wss://catchup-media-server.onrender.com/meet",
      brokerURL: "ws://localhost:8080/meet",
      debug: function (str) {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 10000,
      onConnect: (frame) => {
        console.log("Entered onconnect");
        for (const topic of subscriptions) {
          const topicName = topic.name;
          console.log("Subscribing to topic ", topicName);
          // The return object has a method called `unsubscribe`
          stompClient.subscribe(topicName, topic.onMessage);
        }
        setStompClient(stompClient);
        setSubscribeFlag(true);
      },
    };
    const stompClient = new Client(stompConfig);

    stompClient.onStompError = (frame) => {
      console.error("Stomp error:", frame);
    };

    stompClient.onWebSocketError = (event) => {
      console.error("WebSocket error:", event);
    };

    stompClient.onWebSocketClose = (event) => {
      console.error("WebSocket closed:", event);
    };

    stompClient.activate();

    // TODO: Implement cleanup function on stomp client, e.g .unsubscribing from subscriptions or closing client
    return () => {
      console.log("Cleanup stomp client...");
      stompClient.deactivate();
    };
  }, []);

  useEffect(() => {
    if (subscribeFlag) {
      subscriptionHandler();
    }
  }, [subscribeFlag]);

  // this is will send offer if offer is ready and client is ready
  useEffect(() => {
    console.log(
      ".........Useeffect for sending offer based on offer and client ready......."
    );
    console.log("offerReady ", isOfferReady);
    console.log("clientReady ", isClientReady);
    if (isOfferReady && isClientReady) {
      console.log("Preparing to send offer...");
      sendOfferToClient();
    } else {
      console.log("Either client or offer is not ready");
    }
    console.log(
      "............................................................................"
    );
  }, [isOfferReady, isClientReady]);

  function sendOfferToClient() {
    if (!isClientReady || !isOfferReady) return;
    // logic to send offer
    handlePublishMessage("/app/application", offer);
  }

  function handleSubscription(subscription) {
    console.log("Subscribing to topic: ", subscription);
    stompClient.subscribe(subscription.topic, subscription.onMessage);
    console.log("SUBSCRIBED to ", subscription);
    setSubscriptions([...subscriptions]);
  }

  function handlePublishMessage(destination, message) {
    console.log(
      "Publishing message: ",
      message,
      "to destination:",
      destination
    );
    stompClient.publish({
      destination: destination,
      body: message,
    });
  }

  const subscriptionHandler = () => {
    const lobbyTopic = "/all/messages";
    handleSubscription({
      topic: lobbyTopic,
      onMessage: (message) => {
        setReceivedMessages((prevMessages) => [...prevMessages, message.body]);
        // wrtie logic here to check if the messafe contains the current meeting ID, if yes, then send mark isCLientReady to true
        // setIsClientReady(true);
        const response = JSON.parse(message.body);
        console.log(response);
        if (response.userID == userID) {
          console.log("This is your message..");
        }

        if (response.userID != userID && response.content == "readySignal") {
          setIsClientReady(true);
        }
      },
    });
  };

  const handleSendMessage = () => {
    handlePublishMessage("/app/application", message);
    setMessage("");
  };

  async function handleStartMeeting() {

    const myRoomId = uuidv4();
    setCurrentRoomID(myRoomId);

    var startMessage = {
      content: "offer",
      userID: userID,
      value: offer,
    };
    const jsonStringMessage = JSON.stringify(startMessage);
    setOffer(jsonStringMessage);
    // handlePublishMessage("/app/application", jsonStringMessage);

    // set true when offer is ready
    setIsOfferReady(true);
  }

  async function handleJoinMeeting() {

    if(currentRoomID != "" && currentRoomID.length > 0) {
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
  }

  const handleRoomIDInputChange = (event) => {
    setCurrentRoomID(event.target.value);
  };

  if (!stompClient) {
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
            {/* filled-button */}
            {/* <button className="text-button" onClick={handleJoinMeeting}>
              Join Meeting
            </button> */}
            <div className="text-button" onClick={handleJoinMeeting} 
              style={{
                color: currentRoomID.length > 0 ? 'white' : '#757575',
                cursor: currentRoomID.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >Join</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catchup;
