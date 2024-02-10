package com.signallingBeta.signallingBeta.service;

import com.signallingBeta.signallingBeta.model.VideoFrameModel;

import java.util.concurrent.CompletableFuture;

public interface VideoProcessing {

    byte[] convertToGrayscale(byte[] frame);
    CompletableFuture<Integer> saveBase64EncodedVideoFrame(VideoFrameModel videoFrameModel);

}
