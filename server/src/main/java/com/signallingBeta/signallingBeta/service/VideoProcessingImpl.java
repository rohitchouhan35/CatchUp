package com.signallingBeta.signallingBeta.service;

import com.signallingBeta.signallingBeta.controller.WebSocketController;
import com.signallingBeta.signallingBeta.model.SimpleMessage;
import com.signallingBeta.signallingBeta.model.VideoFrameModel;
import com.signallingBeta.signallingBeta.repository.VideoFrameRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.LinkedBlockingQueue;

@Service
public class VideoProcessingImpl implements VideoProcessing {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    private BlockingQueue<VideoFrameModel> videoFrameModelBlockingQueue = new LinkedBlockingQueue<>();

    private static int memoryLimitForRam = 100 * 1024; // 100 KB max size to hold
    private static int videoFrameMaxQueueSize = 10;

    @Autowired
    private VideoFrameRepository videoFrameRepository;

    @Override
    public byte[] convertToGrayscale(byte[] frame) {

        int frameLength = frame.length;

        for(int i=0; i<frameLength-3; i+=3) {
            int red = frame[i] & 0xFF;
            int green = frame[i + 1] & 0xFF;
            int blue = frame[i + 2] & 0xFF;
            int avg = (red + green + blue) / 3;
            frame[i] = frame[i + 1] = frame[i + 2] = (byte) avg;
        }

        return frame;
    }

    @Async
    @Override
    public CompletableFuture<Integer> saveBase64EncodedVideoFrame(VideoFrameModel videoFrame) {
        try {

            long start = System.currentTimeMillis();
            long userID = videoFrame.getUserID();
            logger.info("saving video frame of size {}", videoFrame.getPayload().length(), "" + Thread.currentThread().getName());
            // logic to save the video
            videoFrame.setTimestamp(Instant.now());
            memoryLimitForRam -= videoFrame.getPayload().length();
            videoFrameModelBlockingQueue.add(videoFrame);

            if(videoFrameModelBlockingQueue.size() >= videoFrameMaxQueueSize || memoryLimitForRam <= 0) {
                logger.info("Hit max queue size or memory limit for video frames");
                logger.info("Saving frames...");
                saveVideoFrames();
                memoryLimitForRam = 100 * 1024;
                long end = System.currentTimeMillis();
                logger.info("Total time {}", (end - start) + " for saving {}", videoFrameMaxQueueSize);
            }

            return CompletableFuture.completedFuture((int)videoFrame.getPayload().length());
        } catch (Exception e) {

            logger.error("An error encountered while saving frames");
            e.printStackTrace();
            return CompletableFuture.completedFuture(-1);

        }
    }

    @Async
    private void saveVideoFrames() {
        if(videoFrameModelBlockingQueue.size() == 0) {
            return;
        }
        videoFrameRepository.saveAll(videoFrameModelBlockingQueue);
        videoFrameModelBlockingQueue = new LinkedBlockingQueue<>();
    }

}
