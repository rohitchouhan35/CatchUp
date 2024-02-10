package com.signallingBeta.signallingBeta.service;

import com.signallingBeta.signallingBeta.dto.IceCandidateMessage;
import com.signallingBeta.signallingBeta.dto.WebRTCOffer;
import com.signallingBeta.signallingBeta.model.SignalingMessage;

public interface SignallingService {

    void saveOffer(int roomID, WebRTCOffer webRTCOffer);

    WebRTCOffer getOffer(int sessionStorageId);

    WebRTCOffer handleAnswer(WebRTCOffer newWebRTCAnswer);

    public IceCandidateMessage handleIceCandidate(IceCandidateMessage iceCandidateMessage);

}
