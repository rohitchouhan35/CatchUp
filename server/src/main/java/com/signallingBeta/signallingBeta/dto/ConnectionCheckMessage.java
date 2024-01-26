package com.signallingBeta.signallingBeta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionCheckMessage {

    private String userID;
    private String type;

}
