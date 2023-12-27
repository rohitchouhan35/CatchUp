  import React, { useEffect, useState } from "react";
  import { Client } from "@stomp/stompjs";
  import ConnectingPageComponent from "../components/ConnectingPageComponent";
  import "../styles/Catchup.css";

  const Catchup = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [subscribeFlag, setSubscribeFlag] = useState(false);
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
      console.log("Initialize stomp client...");
      const stompConfig = {
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
      if(subscribeFlag) {
        subscriptionHandler();
      }
    }, [subscribeFlag]);
    

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
      const lobbyTopic = '/all/messages';
      handleSubscription({
        topic: lobbyTopic,
        onMessage: (message) => {
          setReceivedMessages((prevMessages) => [...prevMessages, message.body]);
        },
      });
    };

    const handleSendMessage = () => {
      handlePublishMessage("/app/application", message);
      setMessage("");
    };

    const [offer, setOffer] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [meetID, setMeetID] = useState(null);
    let lastSDP = null;
    let lastAnswerSDP = null;

    async function handleStartMeeting() {
      handlePublishMessage("/app/application", "Hi from Catchup!");    
    }

    async function handleJoinMeeting() {
      
    }

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
              <button className="filled-button" onClick={handleJoinMeeting}>
                Join Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Catchup;
