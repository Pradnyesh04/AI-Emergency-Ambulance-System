package com.pradnyesh.emergencybackend.dto;

import java.time.LocalDateTime;

public class SmartDispatchResponse {

    private Long assignmentId;
    private Long emergencyRequestId;
    private Long ambulanceId;
    private String ambulanceNumber;
    private String ambulanceType;
    private String driverName;
    private String driverPhone;
    private String priority;
    private double distanceKm;
    private String status;
    private LocalDateTime assignedAt;

    public SmartDispatchResponse() {
    }

    public SmartDispatchResponse(Long assignmentId, Long emergencyRequestId, Long ambulanceId, String ambulanceNumber, String ambulanceType, String driverName, String driverPhone, String priority, double distanceKm, String status, LocalDateTime assignedAt) {
        this.assignmentId = assignmentId;
        this.emergencyRequestId = emergencyRequestId;
        this.ambulanceId = ambulanceId;
        this.ambulanceNumber = ambulanceNumber;
        this.ambulanceType = ambulanceType;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.priority = priority;
        this.distanceKm = distanceKm;
        this.status = status;
        this.assignedAt = assignedAt;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
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

    public String getAmbulanceNumber() {
        return ambulanceNumber;
    }

    public void setAmbulanceNumber(String ambulanceNumber) {
        this.ambulanceNumber = ambulanceNumber;
    }

    public String getAmbulanceType() {
        return ambulanceType;
    }

    public void setAmbulanceType(String ambulanceType) {
        this.ambulanceType = ambulanceType;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverPhone() {
        return driverPhone;
    }

    public void setDriverPhone(String driverPhone) {
        this.driverPhone = driverPhone;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(double distanceKm) {
        this.distanceKm = distanceKm;
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
}
