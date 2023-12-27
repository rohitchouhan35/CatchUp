package com.signallingBeta.signallingBeta.service;

import com.signallingBeta.signallingBeta.model.SignalingMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Random;

@Service
public class SignallingServiceImpl implements SignallingService {

    private static final Logger log = LoggerFactory.getLogger(SignallingServiceImpl.class);
    private final HashMap<Integer, SignalingMessage> sessionStorage = new HashMap<>();
    private int sessionStorageId = 0;

    @Override
    public SignalingMessage saveOffer(String offer) {
        sessionStorageId++;
        sessionStorage.put(sessionStorageId, new SignalingMessage(sessionStorageId, offer, null));
        log.info("Saved offer: {} ", sessionStorage.get(sessionStorageId));
        return sessionStorage.get(sessionStorageId);
    }

    @Override
    public SignalingMessage getOffer(int sessionStorageId) {
        return sessionStorage.get(sessionStorageId);
    }

    @Override
    public SignalingMessage saveAnswer(SignalingMessage signalingMessage) {
        log.info("SignalingMessage from peerB {} : " + signalingMessage);
        sessionStorage.put(signalingMessage.getSessionStorageId(), signalingMessage);
        log.info("Saved answer: {} ", signalingMessage);
        return sessionStorage.get(sessionStorageId);
    }

    @Override
    public SignalingMessage getAnswer(int sessionStorageId) {
        return sessionStorage.get(sessionStorageId);
    }
}
