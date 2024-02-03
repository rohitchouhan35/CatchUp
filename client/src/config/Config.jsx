import { Client, StompHeaders } from "@stomp/stompjs";

class StompConnection {
  constructor(brokerURL, onConnectCallback) {
    this.stompConfig = {
      brokerURL: brokerURL,
      debug: (str) => console.log("STOMP: " + str),
      reconnectDelay: 10000,
      onConnect: onConnectCallback,
    };
    this.stompClient = new Client(this.stompConfig);
    this.stompClient.onStompError = (frame) => console.error("Stomp error:", frame);
    this.stompClient.onWebSocketError = (event) => console.error("WebSocket error:", event);
    this.stompClient.onWebSocketClose = (event) => console.error("WebSocket closed:", event);
  }

  activate() {
    this.stompClient.activate();
  }

  deactivate() {
    this.stompClient.deactivate();
  }

  subscribe(topic, onMessageCallback) {
    this.stompClient.subscribe(topic, onMessageCallback);
  }

  publish(destination, message) {
    this.stompClient.publish({
      destination: destination,
      body: message,
    });
  }

  sendFrame(destination, body, headers = {}) {
    const stompHeaders = new StompHeaders(headers);
  
    this.stompClient.publish({
      destination: destination,
      body: body,
      ...stompHeaders,
    });
  }
}

export default StompConnection;
