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
  const userName = "Rob-" + Math.floor(Math.random() * 100000);
  const password = "x";
  useEffect(() => {
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

  function handleStompConnect(frame) {
    console.log("Connected to server");
    setSubscribeFlag(true);
  }

  useEffect(() => {
    if (subscribeFlag) {
      subscribeToPrivateRoom();
    }
  }, [subscribeFlag]);

  const subscribeToPrivateRoom = () => {
    const topic = `/user/${chatSessionID}/private`;
    stompConnection.subscribe(topic, onPrivateRoomMessageReceived);
  };

  useEffect(() => {
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
            connection.emit("sendIceCandidateToSignalingServer", {
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
        connection.emit("newOffer", offer);
      } catch (err) {
        console.log(err);
      }
    };

    connection.on("newAnswer", (offerObj) => {
      answerOffer(offerObj);
    });

    connection.on("answerResponse", (offerObj) => {
      addAnswer(offerObj);
    });

    connection.on("newIceCandidate", (iceCandidate) => {
      addNewIceCandidate(iceCandidate);
    });

    const answerOffer = async (offerObj) => {
      await fetchUserMedia();
      await createPeerConnection(offerObj);
      const answer = await peerConnection.createAnswer({});
      await peerConnection.setLocalDescription(answer);
      offerObj.answer = answer;
      const offerIceCandidates = await connection.emitWithAck(
        "newAnswer",
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
      // Cleanup logic if needed
    };
  }, [peerConnection, didIOffer, userName, connection]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline controls />
      <video ref={remoteVideoRef} autoPlay playsInline controls />
      <button id="call">Call</button>
    </div>
  );
};

export default WebRTCComponent;
