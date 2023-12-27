package com.signallingBeta.signallingBeta.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignalingMessage {

    private int sessionStorageId;
    private String offer;
    private String answer;

}
