package com.signallingBeta.signallingBeta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebRTCOffer {

    private int roomID;
    private String offererUserName;
    private String offer;
    private List<String> offerIceCandidates;
    private String answererUserName;
    private String answer;
    private List<String> answererIceCandidates;

}
