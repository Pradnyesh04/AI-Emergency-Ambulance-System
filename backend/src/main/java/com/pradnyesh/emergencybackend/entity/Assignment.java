package com.pradnyesh.emergencybackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long emergencyRequestId;

    private Long ambulanceId;

    private String status;

    private LocalDateTime assignedAt;

    private LocalDateTime completedAt;

    public Assignment() {
    }

    public Assignment(Long emergencyRequestId, Long ambulanceId, String status, LocalDateTime assignedAt, LocalDateTime completedAt) {
        this.emergencyRequestId = emergencyRequestId;
        this.ambulanceId = ambulanceId;
        this.status = status;
        this.assignedAt = assignedAt;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmergencyRequestId() {
        return emergencyRequestId;
    }

    public void setEmergencyRequestId(Long emergencyRequestId) {
        this.emergencyRequestId = emergencyRequestId;
    }

    public Long getAmbulanceId() {
        return ambulanceId;
    }

    public void setAmbulanceId(Long ambulanceId) {
        this.ambulanceId = ambulanceId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }

    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
