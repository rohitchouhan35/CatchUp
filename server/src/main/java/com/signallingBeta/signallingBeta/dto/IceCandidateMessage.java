package com.signallingBeta.signallingBeta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IceCandidateMessage {

    private String iceCandidate;
    private String iceUserName;
    private boolean didIOffer;


}
