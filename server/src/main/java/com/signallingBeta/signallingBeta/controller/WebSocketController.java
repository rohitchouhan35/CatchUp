package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.dto.ConnectionCheckMessage;
import com.signallingBeta.signallingBeta.model.SimpleMessage;
import com.signallingBeta.signallingBeta.repository.SimpleMessageRepository;
import com.signallingBeta.signallingBeta.service.ChatMessageQueueService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@CrossOrigin("*")
@RequestMapping("/")
@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageQueueService chatMessageQueueService;

    @Autowired
    private SimpleMessageRepository simpleMessageRepository;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/room")
    @SendTo("/room/messages")
    public SimpleMessage send(final SimpleMessage simpleMessage) throws Exception {
        chatMessageQueueService.enqueueMessage(simpleMessage);
        return simpleMessage;
    }

    @MessageMapping("/connection")
    @SendTo("/connection/check")
    public ConnectionCheckMessage checkClientServerConnection(final ConnectionCheckMessage connectionCheckMessage)
            throws Exception {
        logger.info("message received for connection check...");
        return connectionCheckMessage;
    }

    @MessageMapping("/private")
    public SimpleMessage recMessage(@Payload SimpleMessage message) {
        messagingTemplate.convertAndSendToUser(message.getReceiverID(), "/private", message);
//        chatMessageQueueService.enqueueMessage(message);
        simpleMessageRepository.save(message);
        return message;
    }

    @MessageMapping("/room/welcome")
    @SendTo("/room/greetings")
    public String welcomeMessage() {
        String username = "Sunflower";
        return "Welcome, " + username + "! You are connected.";
    }
}
