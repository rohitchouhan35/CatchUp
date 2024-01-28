package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.dto.IceCandidateMessage;
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

    private final List<WebRTCOffer> offers = new ArrayList<>();

    private final Map<String, String> usernameToSessionIdMap = new ConcurrentHashMap<>();

    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    public SignalingController(SignallingService signallingService, SimpMessagingTemplate simpMessagingTemplate) {
        this.signallingService = signallingService;
        this.messagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/signal")
    @SendTo("/availableOffers")
    public List<WebRTCOffer> userEntryPointForWebRTCSignalling(@Payload String username, SimpMessageHeaderAccessor headerAccessor)
            throws Exception {
        logger.info("A new user in the video room with username: " + username);
        if(username != null) {
            usernameToSessionIdMap.put(username, headerAccessor.getSessionId());
        }
        if(offers.size() > 0) {
            return offers;
        }
        return null;
    }

    @MessageMapping("/newOffer")
    public void handleNewOffer(WebRTCOffer newWebRTCOffer, Principal principal) {
        logger.info("New offer came..... " + newWebRTCOffer.toString());
        String userName = newWebRTCOffer.getOffererUserName();

        WebRTCOffer newOffer = new WebRTCOffer(userName, newWebRTCOffer.getOffer(), null, null, null, null);
        offers.add(newOffer);

        // Send out to all connected sockets except the caller
        for (Map.Entry<String, String> entry : usernameToSessionIdMap.entrySet()) {
            if (!entry.getKey().equals(userName)) {
                logger.info("Got room mate to share offer");
                messagingTemplate.convertAndSendToUser(entry.getValue(), "/newOfferAwaiting", newOffer);
            }
        }
    }

    @MessageMapping("/newAnswer")
    public void handleNewAnswer(WebRTCOffer newWebRTCAnswer, Principal principal) {
        String userName = newWebRTCAnswer.getAnswererUserName();
        String sessionId = principal.getName();

        // Find the corresponding WebRTCOffer
        Optional<WebRTCOffer> optionalOffer = offers.stream()
                .filter(offer -> offer.getOffererUserName().equals(userName))
                .findFirst();

        if (!optionalOffer.isPresent()) {
            System.out.println("No matching WebRTCOffer");
            return;
        }

        WebRTCOffer offerToUpdate = optionalOffer.get();

        // Send back to the answerer all the iceCandidates we have already collected
        messagingTemplate.convertAndSendToUser(sessionId, "/answerResponse", offerToUpdate.getOfferIceCandidates());

        // Update the WebRTCOffer with the received answer
        offerToUpdate.setAnswer(newWebRTCAnswer.getAnswer());
        offerToUpdate.setAnswererUserName(userName);

        // Send the answer response to the offerer
        String offererSessionId = usernameToSessionIdMap.get(offerToUpdate.getOffererUserName());
        messagingTemplate.convertAndSendToUser(offererSessionId, "/answerResponse", offerToUpdate);
    }

    @MessageMapping("/sendIceCandidateToSignalingServer")
    public void handleIceCandidate(IceCandidateMessage iceCandidateMessage, Principal principal) {
        String userName = iceCandidateMessage.getIceUserName();
        String sessionId = principal.getName();

        // Find the corresponding WebRTCOffer
        Optional<WebRTCOffer> optionalOffer = offers.stream()
                .filter(offer -> offer.getOffererUserName().equals(userName) || offer.getAnswererUserName().equals(userName))
                .findFirst();

        if (!optionalOffer.isPresent()) {
            System.out.println("No matching WebRTCOffer");
            return;
        }

        WebRTCOffer offerInOffers = optionalOffer.get();

        // Add ice candidate to the corresponding WebRTCOffer
        offerInOffers.getOfferIceCandidates().add(iceCandidateMessage.getIceCandidate());

        // Find the target user's session ID
        String targetSessionId;
        if (iceCandidateMessage.isDidIOffer()) {
            targetSessionId = usernameToSessionIdMap.get(offerInOffers.getAnswererUserName());
        } else {
            targetSessionId = usernameToSessionIdMap.get(offerInOffers.getOffererUserName());
        }

        // Pass it through to the other socket
        messagingTemplate.convertAndSendToUser(targetSessionId, "/receivedIceCandidateFromServer", iceCandidateMessage.getIceCandidate());
    }

}
