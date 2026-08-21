package com.pradnyesh.emergencybackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "emergency_requests")
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private String phoneNumber;

    private String emergencyType;

    private String location;

    private String status;

    private Double latitude;

    private Double longitude;

    public EmergencyRequest() {
    }

    public EmergencyRequest(String patientName, String phoneNumber, String emergencyType, String location, String status) {
        this.patientName = patientName;
        this.phoneNumber = phoneNumber;
        this.emergencyType = emergencyType;
        this.location = location;
        this.status = status;
    }

    public EmergencyRequest(String patientName, String phoneNumber, String emergencyType, String location, String status, Double latitude, Double longitude) {
        this.patientName = patientName;
        this.phoneNumber = phoneNumber;
        this.emergencyType = emergencyType;
        this.location = location;
        this.status = status;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmergencyType() {
        return emergencyType;
    }

    public void setEmergencyType(String emergencyType) {
        this.emergencyType = emergencyType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getLatitude() {
        if ((latitude == null || latitude == 0.0) && location != null && location.contains(",")) {
            try {
                String[] parts = location.split(",");
                return Double.parseDouble(parts[0].trim());
            } catch (Exception ignored) {
            }
        }
        return latitude != null ? latitude : 0.0;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        if ((longitude == null || longitude == 0.0) && location != null && location.contains(",")) {
            try {
                String[] parts = location.split(",");
                return Double.parseDouble(parts[1].trim());
            } catch (Exception ignored) {
            }
        }
        return longitude != null ? longitude : 0.0;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
