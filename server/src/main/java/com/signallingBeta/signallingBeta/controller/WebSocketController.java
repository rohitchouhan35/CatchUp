package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.dto.SimpleInfoExchangeMessage;
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

    @MessageMapping("/room")
    @SendTo("/room/messages")
    public SimpleInfoExchangeMessage send(final SimpleInfoExchangeMessage simpleInfoExchangeMessage) throws Exception {
        return simpleInfoExchangeMessage;
    }

//    @MessageMapping("/room")
//    @SendTo("/room/messages")
    @MessageMapping("/private-message")
    public SimpleMessage recMessage(@Payload SimpleMessage message) {
        messagingTemplate.convertAndSendToUser(message.getReceiverID(),"/private",message);
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
