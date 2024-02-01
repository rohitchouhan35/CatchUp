package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.service.VideoProcessing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Base64;

@Controller
@CrossOrigin("*")
public class LiveVideoRecording {

    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private VideoProcessing videoProcessing;

    public LiveVideoRecording(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/live-video")
    @SendTo("/media/live-feed")
    public String handleLiveVideoFrame(@Payload String videoFrame) throws IOException {
        byte[] decodedVideoFrame = Base64.getDecoder().decode(videoFrame);

        System.out.println("Received total " + decodedVideoFrame.length + " Bytes.");

        byte[] grayScaledFrame = videoProcessing.convertToGrayscale(decodedVideoFrame);

//        return grayScaledFrame;
        return videoFrame;
    }

}
