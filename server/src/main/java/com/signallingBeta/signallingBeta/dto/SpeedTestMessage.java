package com.signallingBeta.signallingBeta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpeedTestMessage {

    private Long leavingTimeStamp;
    private Long clientTimeStamp;
    private String dummyMessage;

}
