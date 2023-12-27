package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.model.SimpleMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin("*")
@RequestMapping("/")
@Controller
public class WebSocketController {

    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/sendPrivateMessage/{targetUserId}")
    public void sendPrivateMessage(String message, SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String targetUserId) {
        String senderUsername = "senderUserName";
        String destination = "/user/" + targetUserId + "/private";
        messagingTemplate.convertAndSendToUser(targetUserId, destination, "Private message from " + senderUsername + ": " + message);
    }

    @MessageMapping("/sendToRoom/{roomName}")
    public void sendToRoom(String message, SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomName) {
        String messageToSend = "Hi! this message is generated for room: " + roomName + " with message: " + message;
        messagingTemplate.convertAndSend("/topic/" + roomName, messageToSend);
    }

    @MessageMapping("/application")
    @SendTo("/all/messages")
    public SimpleMessage send(final SimpleMessage simpleMessage) throws Exception {
        return simpleMessage;
    }

    @MessageMapping("/private-message")
    public SimpleMessage recMessage(@Payload SimpleMessage message) {
        messagingTemplate.convertAndSendToUser(message.getSendTo(),"/private",message);
        System.out.println(message.toString());
        return message;
    }

    @MessageMapping("/welcome")
    @SendTo("/topic/greetings")
    public String welcomeMessage() {
        String username = "Sunflower";
        return "Welcome, " + username + "! You are connected.";
    }
}
