package com.signallingBeta.signallingBeta.repository;

import com.signallingBeta.signallingBeta.model.SimpleMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimpleMessageRepository extends JpaRepository<SimpleMessage, Long> {

    @Modifying
    @Query(value = "INSERT INTO assignment (column1, column2, due_date, created_by) VALUES :assignments", nativeQuery = true)
    void saveBatchAssignments(@Param("assignments") List<SimpleMessage> assignments);

}
