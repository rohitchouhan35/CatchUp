package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.dto.IceCandidateMessage;
import com.signallingBeta.signallingBeta.dto.NewOfferObj;
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
    private SignallingService signallingService;

    private WebRTCOffer masterWebRTCOffer = null;

    private final Map<String, String> usernameToSessionIdMap = new ConcurrentHashMap<>();

    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    public SignalingController(SignallingService signallingService, SimpMessagingTemplate simpMessagingTemplate) {
        this.signallingService = signallingService;
        this.messagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/signal")
    @SendTo("/signal/availableOffers")
    public WebRTCOffer userEntryPointForWebRTCSignalling(String username)
            throws Exception {
        logger.info("A new user in the video room with username: " + username);
        logger.info("master offer in signal is: " + masterWebRTCOffer.toString());
        return masterWebRTCOffer;
    }

    @MessageMapping("/newOffer")
    @SendTo("/signal/newOfferAwaiting")
    public WebRTCOffer handleNewOffer(NewOfferObj newOfferObj) {
//        logger.info("New offer came..... " + newOfferObj.toString());
        String userName = newOfferObj.getUsername();
        String offer = newOfferObj.getOffer();
        WebRTCOffer newWebRTCOffer = new WebRTCOffer(userName, offer, new ArrayList<>(), null, null, new ArrayList<>());
        if(offer != null && offer != "") {
            masterWebRTCOffer = newWebRTCOffer;
        }
        logger.info("master offer in new offer is: " + masterWebRTCOffer.toString());
        return masterWebRTCOffer;
    }

    @MessageMapping("/newAnswer")
    @SendTo("/signal/answerResponse")
    public WebRTCOffer handleNewAnswer(WebRTCOffer newWebRTCAnswer, SimpMessageHeaderAccessor headerAccessor) {
        logger.info("New answer received: " + newWebRTCAnswer.toString());
        String userName = newWebRTCAnswer.getOffererUserName();
        logger.info("Found this matching webrtc offer: " + masterWebRTCOffer);

        masterWebRTCOffer.setAnswer(newWebRTCAnswer.getAnswer());
        masterWebRTCOffer.setAnswererUserName(userName);
        logger.info("master offer in new answer is: " + masterWebRTCOffer.toString());
        return masterWebRTCOffer;
    }

    @MessageMapping("/sendIceCandidateToSignalingServer")
    @SendTo("/signal/receivedIceCandidateFromServer")
    public IceCandidateMessage handleIceCandidate(IceCandidateMessage iceCandidateMessage) {
        logger.info("Got ice candidate in sendIceCandidateToSignalingServer");
        logger.info(iceCandidateMessage.toString());

        String currentIceUserName = iceCandidateMessage.getIceUserName();
        String currIce = iceCandidateMessage.getIceCandidate();
        boolean didIOffer = iceCandidateMessage.isDidIOffer();

        if(didIOffer) {
            logger.info("This ice is from offerer");
            List<String> tempIceCandidates = masterWebRTCOffer.getOfferIceCandidates();
            tempIceCandidates.add(currIce);
            masterWebRTCOffer.setOfferIceCandidates(tempIceCandidates);
        } else {
            logger.info("This ice is from answer");
            List<String> tempIceCandidates = masterWebRTCOffer.getAnswererIceCandidates();
            tempIceCandidates.add(currIce);
            masterWebRTCOffer.setAnswererIceCandidates(tempIceCandidates);
        }

        logger.info("iceCandidateMessage in send ice: " + iceCandidateMessage);
        logger.info("master webrtc offer with ice candidates xx: " + masterWebRTCOffer.toString());

        return iceCandidateMessage;
    }

}
