package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.dto.IceCandidateMessage;
import com.signallingBeta.signallingBeta.dto.NewOfferObj;
import com.signallingBeta.signallingBeta.dto.UserRequestData;
import com.signallingBeta.signallingBeta.dto.WebRTCOffer;
import com.signallingBeta.signallingBeta.service.SignallingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/")
@CrossOrigin("*")
public class SignalingController {

    @GetMapping("/home")
    public String test() {
        return "Hi! time is now: " + LocalDateTime.now();
    }

    private static final Logger logger = LoggerFactory.getLogger(SignalingController.class);

    @Autowired
    private final SignallingService signallingService;

    private final Map<String, String> usernameToSessionIdMap = new ConcurrentHashMap<>();

    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    public SignalingController(SignallingService signallingService, SimpMessagingTemplate simpMessagingTemplate) {
        this.signallingService = signallingService;
        this.messagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/signal")
    @SendTo("/signal/availableOffers")
    public WebRTCOffer userEntryPointForWebRTCSignalling(@Payload UserRequestData userRequestData) throws Exception {
        try {
            logger.info("A new user in room {} with username: {}", userRequestData.getRoomID(), userRequestData.getUsername());
            return signallingService.getOffer(userRequestData.getRoomID());
        } catch (Exception e) {
            logger.error("Error processing WebRTC signalling for user: {}", userRequestData.getUsername(), e);
            throw new RuntimeException("Error processing WebRTC signalling", e);
        }
    }

    @MessageMapping("/newOffer")
    @SendTo("/signal/newOfferAwaiting")
    public WebRTCOffer handleNewOffer(@Payload NewOfferObj newOfferObj) {
        try {
            if (newOfferObj.getRoomID() == -1 || newOfferObj.getOffer().isBlank()) {
                logger.info("Invalid offer for room ID: {}", newOfferObj.getRoomID());
                return null;
            }
            logger.info("New offer with room ID: {}", newOfferObj.getRoomID());
            WebRTCOffer newWebRTCOffer = new WebRTCOffer(newOfferObj.getRoomID(), newOfferObj.getUsername(), newOfferObj.getOffer(), new ArrayList<>(), null, null, new ArrayList<>());
            signallingService.saveOffer(newOfferObj.getRoomID(), newWebRTCOffer);
            return newWebRTCOffer;
        } catch (Exception e) {
            logger.error("Error handling new offer for user: {}", newOfferObj.getUsername(), e);
            throw new RuntimeException("Error handling new offer", e);
        }
    }

    @MessageMapping("/newAnswer")
    @SendTo("/signal/answerResponse")
    public WebRTCOffer handleNewAnswer(@Payload WebRTCOffer newWebRTCAnswer) {
        try {
            logger.info("New answer received");
            if (newWebRTCAnswer == null || newWebRTCAnswer.getOffererUserName() == null) {
                logger.info("Missing field.");
                return null;
            }
            return signallingService.handleAnswer(newWebRTCAnswer);
        } catch (Exception e) {
            assert newWebRTCAnswer != null;
            logger.error("Error handling new answer for offerer: {}", newWebRTCAnswer.getOffererUserName(), e);
            throw new RuntimeException("Error handling new answer", e);
        }
    }

    @MessageMapping("/sendIceCandidateToSignalingServer")
    @SendTo("/signal/receivedIceCandidateFromServer")
    public IceCandidateMessage handleIceCandidate(IceCandidateMessage iceCandidateMessage) {
        try {
            if (iceCandidateMessage.getIceCandidate().isBlank()) {
                logger.info("Missing candidates or missing fields");
                return null;
            }

            logger.info("Got ice candidate in handleIceCandidate");
            return signallingService.handleIceCandidate(iceCandidateMessage);
        } catch (Exception e) {
            logger.error("Error handling ice candidate for room ID: {}", iceCandidateMessage.getRoomID(), e);
            throw new RuntimeException("Error handling ice candidate", e);
        }
    }

}
