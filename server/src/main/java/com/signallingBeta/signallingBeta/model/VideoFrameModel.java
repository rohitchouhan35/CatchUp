package com.signallingBeta.signallingBeta.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.signallingBeta.signallingBeta.utility.BlobDeserializer;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;
import java.time.Instant;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoFrameModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userID;
    private Instant timestamp;
    @JsonDeserialize(using = BlobDeserializer.class)
    private Blob payload;

}
