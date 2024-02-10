package com.signallingBeta.signallingBeta.service;

import com.signallingBeta.signallingBeta.dto.IceCandidateMessage;
import com.signallingBeta.signallingBeta.dto.WebRTCOffer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class SignallingServiceImpl implements SignallingService {

    private static final Logger logger = LoggerFactory.getLogger(SignallingServiceImpl.class);
    private static final HashMap<Integer, WebRTCOffer> webRTCOfferHashMap = new HashMap<>();

    @Override
    public void saveOffer(int roomID, WebRTCOffer webRTCOffer) {
        try {
            if (webRTCOfferHashMap.containsKey(roomID)) {
                logger.info("Updating existing offer for room ID: {}", roomID);
            } else {
                logger.info("Saving new offer for room ID: {}", roomID);
            }
            printAvailableRoomIDsAndOffers();
            webRTCOfferHashMap.put(roomID, webRTCOffer);
        } catch (Exception e) {
            logger.error("Error in saving offer for room ID: {}", roomID, e);
        }
    }

    @Override
    public WebRTCOffer getOffer(int roomID) {
        try {
            if (webRTCOfferHashMap.containsKey(roomID)) {
                logger.info("Found requested offer for room ID: {}", roomID);
                printAvailableRoomIDsAndOffers();
                return webRTCOfferHashMap.get(roomID);
            } else {
                logger.info("No offer found for room ID: {}", roomID);
                printAvailableRoomIDsAndOffers();
                return null;
            }
        } catch (Exception e) {
            logger.error("Error in retrieving offer for room ID: {}", roomID, e);
            printAvailableRoomIDsAndOffers();
            return null;
        }
    }

    @Override
    public WebRTCOffer handleAnswer(WebRTCOffer newWebRTCAnswer) {
        try {
            int roomID = newWebRTCAnswer.getRoomID();
            if (!webRTCOfferHashMap.containsKey(roomID)) {
                logger.error("Invalid answer or offer not found for room ID: {}", roomID);
                printAvailableRoomIDsAndOffers();
                return null;
            }

            WebRTCOffer existingOffer = webRTCOfferHashMap.get(roomID);
            existingOffer.setAnswer(newWebRTCAnswer.getAnswer());
            existingOffer.setAnswererUserName(newWebRTCAnswer.getAnswererUserName());
            webRTCOfferHashMap.put(roomID, existingOffer);
            logger.info("Offer updated successfully for room ID: {}", roomID);

            printAvailableRoomIDsAndOffers();
            return existingOffer;

        } catch (Exception e) {
            logger.error("Error in updating offer with room ID: {}", newWebRTCAnswer.getRoomID(), e);
        }

        printAvailableRoomIDsAndOffers();
        return null;
    }

    @Override
    public IceCandidateMessage handleIceCandidate(IceCandidateMessage iceCandidateMessage) {
        try {
            logger.info("Got ice candidate in handleIceCandidate");

            int roomID = iceCandidateMessage.getRoomID() != -1 ? iceCandidateMessage.getRoomID() : -1;
            if (!webRTCOfferHashMap.containsKey(roomID)) {
                logger.info("Lost ice candidates for room ID: {}", roomID);
                return null;
            }

            String currIce = iceCandidateMessage.getIceCandidate();
            boolean didIOffer = iceCandidateMessage.isDidIOffer();

            if (didIOffer) {
                logger.info("This ice is from offerer");
                List<String> tempIceCandidates = webRTCOfferHashMap.get(roomID).getOfferIceCandidates();
                tempIceCandidates.add(currIce);
                webRTCOfferHashMap.get(roomID).setOfferIceCandidates(tempIceCandidates);
            } else {
                logger.info("This ice is from answer");
                List<String> tempIceCandidates = webRTCOfferHashMap.get(roomID).getAnswererIceCandidates();
                tempIceCandidates.add(currIce);
                webRTCOfferHashMap.get(roomID).setAnswererIceCandidates(tempIceCandidates);
            }

            printAvailableRoomIDsAndOffers();
            return iceCandidateMessage;
        } catch (Exception e) {
            logger.error("Error handling ice candidate for room ID: {}", iceCandidateMessage.getRoomID(), e);
            throw new RuntimeException("Error handling ice candidate", e);
        }
    }

    private void printAvailableRoomIDsAndOffers() {
        System.out.printf("%-10s%-20s\n", "Room ID", "Offer Length");
        System.out.println("-------------------------------");

        for (int i = -1; i < 2000; i++) {
            if (webRTCOfferHashMap.containsKey(i)) {
                WebRTCOffer webRTCOffer = webRTCOfferHashMap.get(i);
                System.out.printf("%-10s%-20s\n", i, webRTCOffer != null ? webRTCOffer.getOffer().length() : "N/A");
            }
        }

        System.out.println("-------------------------------");
    }

}
