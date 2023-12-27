package com.signallingBeta.signallingBeta.service;

import com.signallingBeta.signallingBeta.model.SignalingMessage;

public interface SignallingService {

    SignalingMessage saveOffer(String offer);

    SignalingMessage getOffer(int sessionStorageId);

    SignalingMessage saveAnswer(SignalingMessage signalingMessage);

    SignalingMessage getAnswer(int sessionStorageId);

}
