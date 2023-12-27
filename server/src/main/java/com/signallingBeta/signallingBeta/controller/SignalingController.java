package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.model.SignalingMessage;
import com.signallingBeta.signallingBeta.service.SignallingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@CrossOrigin("*")
public class SignalingController {

    @Autowired
    private SignallingService signallingService;

    @PostMapping("/save-offer")
    public SignalingMessage saveOffer(@RequestBody String offer) {
        return signallingService.saveOffer(offer);
    }

    @PostMapping("/save-answer")
    public SignalingMessage saveAnswer(@RequestBody SignalingMessage signalingMessage) {
        return signallingService.saveAnswer(signalingMessage);
    }

    @GetMapping("/get-offer")
    public SignalingMessage getOffer(@RequestParam int sessionStorageId) {
        return signallingService.getOffer(sessionStorageId);
    }

    @GetMapping("/get-answer")
    public SignalingMessage getAnswer(@RequestParam int sessionStorageId) {
        return signallingService.getAnswer(sessionStorageId);
    }

}
