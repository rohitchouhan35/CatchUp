package com.signallingBeta.signallingBeta.controller;

import com.signallingBeta.signallingBeta.model.VideoFrameModel;
import com.signallingBeta.signallingBeta.service.VideoProcessing;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Controller;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.Base64;

@Controller
@CrossOrigin("*")
public class LiveVideoRecording {

    private static final Logger logger = LoggerFactory.getLogger(LiveVideoRecording.class);

    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private VideoProcessing videoProcessing;

    public LiveVideoRecording(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

//    @MessageMapping("/live-video")
//    @SendTo("/media/live-feed")
//    public String handleLiveVideoFrame(@Payload VideoFrameModel videoFrameModel) throws IOException {
////        byte[] decodedVideoFrame = Base64.getDecoder().decode(videoFrameModel.getPayload());
//        logger.info("Received total " + videoFrameModel.getPayload().toString().length() + " Bytes.");
//        videoProcessing.saveBase64EncodedVideoFrame(videoFrameModel);
//        return videoFrameModel.getPayload().toString();
//    }

    @MessageMapping("/live-video")
    @SendTo("/media/live-feed")
    public String handleLiveVideoFrame(@Payload String videoFrame) throws IOException {
        logger.info("Received total " + videoFrame.length() + " Bytes.");
        return videoFrame;
    }

    @MessageMapping("/live-binary-video")
    @SendTo("/media/live-binary-feed")
    public Message<byte[]> handleBinaryVideoFrame(@Payload byte[] binaryData) {
        logger.info("Got binary byte array of " + binaryData.length + " size");

        MessageHeaders headers = MessageBuilder.withPayload(binaryData)
                .setHeader(MessageHeaders.CONTENT_TYPE, MimeTypeUtils.APPLICATION_OCTET_STREAM)
                .build().getHeaders();

        Message<byte[]> binaryMessage = MessageBuilder.createMessage(binaryData, headers);

        return binaryMessage;
    }

}
