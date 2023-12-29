package com.signallingBeta.signallingBeta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleInfoExchangeMessage {

    private String content;
    private String userID;
    private String value;

}
