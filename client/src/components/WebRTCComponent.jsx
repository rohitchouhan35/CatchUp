import React, { useEffect, useRef, useState } from "react";
import StompConnection from "../config/Config.jsx";

const WebRTCComponent = () => {
  const [stompConnection, setStompConnection] = useState(null);
  const [subscribeFlag, setSubscribeFlag] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [didIOffer, setDidIOffer] = useState(false);
  const userName = "Rohit-" + Math.floor(Math.random() * 100000);

  useEffect(() => {
    const connection = new StompConnection(
      // "wss://catchup-media-server.onrender.com/meet",
      // "ws://localhost:8080/meet",
      "wss://catchup-media-server-beta.onrender.com/meet",
      handleStompConnect
    );
    setStompConnection(connection);
    connection.activate();

    function handleStompConnect(frame) {
      console.log("Connected to server");
      setSubscribeFlag(true);
    }
  }, []); // <- Empty dependency array, runs only once on mount

  useEffect(() => {

    const onNewAnswer = (offerObj) => {
      answerOffer(offerObj);
    };

    const onNewIceCandidate = (iceCandidate) => {
      addNewIceCandidate(iceCandidate);
    };

    //on connection get all available offers and call createOfferEls
    const onAvailableOffers = (offers) => {
      console.log(offers);
      createOfferEls(offers);
    };

    //someone just made a new offer and we're already here - call createOfferEls
    const onNewOfferAwaiting = (offers) => {
      createOfferEls(offers);
    }

    const onAnswerResponse = (offerObj) => {
      console.log(offerObj);
      addAnswer(offerObj);
    }

    const onReceivedIceCandidateFromServer = (iceCandidate) => {
      addNewIceCandidate(iceCandidate);
      console.log(iceCandidate);
    }

    if (subscribeFlag) {
      subscribeToSingallingTopics();
    }

    function subscribeToSingallingTopics() {
      stompConnection.subscribe("/signal/newAnswer", onNewAnswer);
      stompConnection.subscribe("/signal/newIceCandidate", onNewIceCandidate);
      stompConnection.subscribe("/signal/availableOffers", onAvailableOffers);
      stompConnection.subscribe("/signal/newOfferAwaiting", onNewOfferAwaiting);
      stompConnection.subscribe("/signal/answerResponse", onAnswerResponse);
      stompConnection.subscribe("/signal/receivedIceCandidateFromServer", onReceivedIceCandidateFromServer);
    }

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

    const createPeerConnection = async (offerObj) => {
      try {
        const peerConfig = {
          iceServers: [
            {
              urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
              ],
            },
          ],
        };
        const pc = new RTCPeerConnection(peerConfig);

        pc.addEventListener("signalingstatechange", (event) => {
          console.log(event);
          console.log(pc.signalingState);
        });

        pc.addEventListener("icecandidate", (e) => {
          console.log("........Ice candidate found!......");
          console.log(e);
          if (e.candidate) {
            stompConnection.publish("/signal/sendIceCandidateToSignalingServer", {
              iceCandidate: e.candidate,
              iceUserName: userName,
              didIOffer,
            });
          }
        });

        pc.addEventListener("track", (e) => {
          console.log("Got a track from the other peer!! How exciting");
          console.log(e);
          e.streams[0].getTracks().forEach((track) => {
            setRemoteStream((prevStream) => {
              const newStream = prevStream || new MediaStream();
              newStream.addTrack(track);
              return newStream;
            });
          });
        });

        if (offerObj) {
          await pc.setRemoteDescription(offerObj.offer);
        }

        setPeerConnection(pc);
      } catch (err) {
        console.log(err);
      }
    };

    const call = async () => {
      await fetchUserMedia();
      await createPeerConnection();

      try {
        console.log("Creating offer...");
        const offer = await peerConnection.createOffer();
        console.log(offer);
        await peerConnection.setLocalDescription(offer);
        setDidIOffer(true);
        stompConnection.publish("/signal/newOffer", offer);
      } catch (err) {
        console.log(err);
      }
    };

    function createOfferEls(offers) {
      //make green answer button for this new offer
      const answerEl = document.querySelector("#answer");
      offers.forEach((o) => {
        console.log(o);
        const newOfferEl = document.createElement("div");
        newOfferEl.innerHTML = `<button class="btn btn-success col-1">Answer ${o.offererUserName}</button>`;
        newOfferEl.addEventListener("click", () => answerOffer(o));
        answerEl.appendChild(newOfferEl);
      });
    }

    const answerOffer = async (offerObj) => {
      await fetchUserMedia();
      await createPeerConnection(offerObj);
      const answer = await peerConnection.createAnswer({});
      await peerConnection.setLocalDescription(answer);
      offerObj.answer = answer;
      const offerIceCandidates = await stompConnection.publish(
        "/signal/newAnswer",
        offerObj
      );
      offerIceCandidates.forEach((c) => {
        peerConnection.addIceCandidate(c);
        console.log("======Added Ice Candidate======");
      });
      console.log(offerIceCandidates);
    };

    const addAnswer = async (offerObj) => {
      await peerConnection.setRemoteDescription(offerObj.answer);
    };

    const addNewIceCandidate = (iceCandidate) => {
      peerConnection.addIceCandidate(iceCandidate);
      console.log("======Added Ice Candidate======");
    };

    document.querySelector("#call").addEventListener("click", call);

    return () => {
      console.log("Cleanup webrtc...");
    };
  }, [peerConnection, didIOffer, userName, subscribeFlag]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline controls />
      <video ref={remoteVideoRef} autoPlay playsInline controls />
      <button id="call">Call</button>
      <div id="answer" className="col"></div>
    </div>
  );
};

export default WebRTCComponent;
