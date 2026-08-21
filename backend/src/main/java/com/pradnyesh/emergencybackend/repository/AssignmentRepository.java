package com.pradnyesh.emergencybackend.repository;

import com.pradnyesh.emergencybackend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByAmbulanceId(Long ambulanceId);
    List<Assignment> findByEmergencyRequestId(Long emergencyRequestId);
}
