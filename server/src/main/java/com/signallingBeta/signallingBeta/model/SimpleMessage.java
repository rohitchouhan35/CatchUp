package com.signallingBeta.signallingBeta.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleMessage {

    private String userID;
    private String type;
    private String content;
    private String receiverID = null;
    private boolean isPrivate = false;
    private String roomID = null;
    private String destination = null;

}
