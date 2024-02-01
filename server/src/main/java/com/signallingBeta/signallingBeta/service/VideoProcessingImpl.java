package com.signallingBeta.signallingBeta.service;

import org.springframework.stereotype.Service;

@Service
public class VideoProcessingImpl implements VideoProcessing {
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
}
