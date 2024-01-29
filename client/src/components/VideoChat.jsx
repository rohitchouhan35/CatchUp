import React, { useEffect, useRef, useState } from "react";
import StompConnection from "../config/Config.jsx";
import Utilities from "../utilities/Utilities.jsx";
import '../styles/VideoChat.css';
import "../styles/Lobby.css";

const VideoChat = () => {
  const localVideoRef = useRef(null);
  const remoteVideoEl = useRef(null);
  const [stompConnection, setStompConnection] = useState(null);
  const [subscribeFlag, setSubscribeFlag] = useState(false);
  const [shouldStartCall, setShouldStartCall] = useState(true);
  // const [localStream, setLocalStream] = useState(null);
  // const [remoteStream, setRemoteStream] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const newRandomUsername = Utilities.generateUniqueUsername("Rohit");
    setUsername(newRandomUsername);
    console.log("New unique username: ", newRandomUsername);
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
    console.log("Entered onconnect with username: ", username);
    setSubscribeFlag(true);
  }

  function subscriptionHandler() {
    // stompConnection.subscribe("/signal/newAnswer", onNewAnswer);
    // stompConnection.subscribe("/signal/newIceCandidate", onNewIceCandidate);
    stompConnection.subscribe("/signal/availableOffers", onAvailableOffers);
    stompConnection.subscribe("/signal/newOfferAwaiting", onNewOfferAwaiting);
    stompConnection.subscribe("/signal/answerResponse", onAnswerResponse);
    stompConnection.subscribe("/signal/addIceCandidateFromOfferer", OnaddIceCandidateFromOfferer);
    stompConnection.subscribe(
      "/signal/receivedIceCandidateFromServer",
      onReceivedIceCandidateFromServer
    );
    stompConnection.publish("/app/signal", JSON.stringify(username));
    // if (shouldStartCall) {
    //   call();
    // }
  }

  const handleCallClick = () => {
    call();
  };

  const addNewIceCandidate = (iceCandidate) => {
    iceCandidate = JSON.parse(iceCandidate);
    console.log(typeof iceCandidate.candidate);
    peerConnection.addIceCandidate(iceCandidate);
  };

  var localStream; //a var to hold the local video stream
  var remoteStream; //a var to hold the remote video stream
  var peerConnection; //the peerConnection that the two clients use to talk
  var didIOffer = false;

  let peerConfiguration = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
      },
    ],
  };

  const call = async () => {
    await fetchUserMedia();
    await createPeerConnection();

    //create offer time!
    try {
      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
      didIOffer = true;
      const newOfferObj = {
        username: username,
        offer: JSON.stringify(offer),
      };
      stompConnection.publish("/app/newOffer", JSON.stringify(newOfferObj)); //send offer to signalingServer
    } catch (err) {
      console.log(err);
    }
  };
  
  const answerOffer = async (offerObj) => {
    await fetchUserMedia();
    await createPeerConnection(offerObj);
    const answer = await peerConnection.createAnswer({});
    await peerConnection.setLocalDescription(answer);
    offerObj.answer = JSON.stringify(answer);
    const offerIceCandidatesXX = stompConnection.publish("/app/newAnswer", JSON.stringify(offerObj));
    const offerIceCandidates = offerObj.offerIceCandidates;
    offerIceCandidates.forEach((c) => {
      c = JSON.parse(c);
      peerConnection.addIceCandidate(c);
    });
  };

  const OnaddIceCandidateFromOfferer = (offerIceCandidates) => {
    offerIceCandidates = JSON.parse(offerIceCandidates.body);
    if(offerIceCandidates.username == username) {
      return;
    }
    offerIceCandidates.forEach((c) => {
      peerConnection.addIceCandidate(c);
    });
  }

  const addAnswer = async (offerObj) => {
    console.log("peerconnection: ", peerConnection);
    const answer = JSON.parse(offerObj.answer);
    await peerConnection.setRemoteDescription(answer);
  };

  const fetchUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: true,
      });
      localVideoRef.current.srcObject = stream;
      // setLocalStream(stream);
      localStream = stream;
    } catch (err) {
      console.log(err);
    }
  };

  const createPeerConnection = async (offerObj) => {
    return new Promise(async (resolve, reject) => {
      peerConnection = await new RTCPeerConnection(peerConfiguration);
      remoteStream = new MediaStream();
      
      // Set up ontrack event handler to handle incoming tracks
      peerConnection.ontrack = (event) => {
        console.log("Got a track from the other peer!! How exciting");
        const [track] = event.streams[0].getTracks();
        console.log("Adding track to remote stream:", track);
        remoteStream.addTrack(track);
        console.log("Here's an exciting moment... fingers crossed", remoteVideoEl);
        
        // Assign remoteStream to the srcObject of remoteVideoEl
        remoteVideoEl.current.srcObject = remoteStream;
      };
  
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
  
      peerConnection.addEventListener("signalingstatechange", (event) => {
        console.log("Signal state change detected...");
        console.log(event);
      });
  
      peerConnection.addEventListener("icecandidate", (e) => {
        if (e.candidate) {
          const iceCandidateMessage = {
            iceCandidate: JSON.stringify(e.candidate),
            iceUserName: username,
            didIOffer,
          };
          stompConnection.publish(
            "/app/sendIceCandidateToSignalingServer",
            JSON.stringify(iceCandidateMessage)
          );
        }
      });
  
      if (offerObj) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(offerObj.offer)));
        } catch (error) {
          console.error("Error setting remote description:", error);
          reject(error);
          return;
        }
      }
  
      resolve();
    });
  };
  
  

  const onAvailableOffers = (offers) => {
    offers = JSON.parse(offers.body);
    createOfferEls(offers);
  };
  function createOfferEls(offers) {
    //make green answer button for this new offer
    const answerEl = document.querySelector("#answer");
      const o = offers;
      const newOfferEl = document.createElement("div");
      newOfferEl.innerHTML = `<button class="btn btn-success col-1">Answer ${o.offererUserName}</button>`;
      newOfferEl.addEventListener("click", () => answerOffer(o));
      answerEl.appendChild(newOfferEl);
  }

  //someone just made a new offer and we're already here - call createOfferEl
  const onNewOfferAwaiting = (offers) => {
    try {
      var offers = JSON.parse(offers.body);
      createOfferEls(offers);
    } catch (error) {
      console.error(
        "Error in receiving message from -- onNewOfferAwaiting -- ",
        error
      );
    }
  };
  const onAnswerResponse = (offerObj) => {
    offerObj = JSON.parse(offerObj.body);
    addAnswer(offerObj);
  };
  const onReceivedIceCandidateFromServer = (iceCandidateMessage) => {
    iceCandidateMessage = JSON.parse(iceCandidateMessage.body);
    try {
      const currIceCreator = iceCandidateMessage.iceUserName;
      if (currIceCreator != username) {
        const currIce = iceCandidateMessage.iceCandidate;
        addNewIceCandidate(currIce);
      } else {

      }
    } catch (error) {
      console.error(
        "Error in receiving message from -- onReceivedIceCandidateFromServer -- ",
        error
      );
    }
  };

  return (
    <>
      <div className="video-container">
        <video
          className="user-card"
          ref={localVideoRef}
          autoPlay
          playsInline
          controls
          style={{
            "transform": "scaleX(-1)"
          }}
        />
        <video
          className="user-card"
          ref={remoteVideoEl}
          autoPlay
          playsInline
          controls
          style={{
            "transform": "scaleX(-1)"
          }}
        />
      </div>
      <button id="call" onClick={handleCallClick}>
        Call
      </button>
      <div id="answer" className="col"></div>
    </>
  );
};

export default VideoChat;
