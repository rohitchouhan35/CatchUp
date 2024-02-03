package com.signallingBeta.signallingBeta.utility;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

public class BlobDeserializer extends JsonDeserializer<Blob> {
    @Override
    public Blob deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        // Implement the logic to convert the JSON representation to a Blob
        // Example: Convert a base64-encoded string to a Blob
        String base64Value = p.getValueAsString();
        byte[] bytes = Base64.getDecoder().decode(base64Value);
        try {
            return new javax.sql.rowset.serial.SerialBlob(bytes);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
