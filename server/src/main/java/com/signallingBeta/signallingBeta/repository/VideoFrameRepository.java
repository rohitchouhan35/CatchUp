package com.signallingBeta.signallingBeta.repository;

import com.signallingBeta.signallingBeta.model.SimpleMessage;
import com.signallingBeta.signallingBeta.model.VideoFrameModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VideoFrameRepository extends JpaRepository<VideoFrameModel, Long> {

    @Query("SELECT v.userID, v.timestamp, v.payload " +
            "FROM VideoFrameModel v " +
            "WHERE v.userID = :userID " +
            "ORDER BY v.timestamp ASC")
    List<VideoFrameModel> findByUserIDOrderByTimestamp(@Param("userID") Long userID);

}
