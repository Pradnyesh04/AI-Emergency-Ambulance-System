package com.pradnyesh.emergencybackend.repository;

import com.pradnyesh.emergencybackend.entity.EmergencyRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Long> {
}
