package com.pradnyesh.emergencybackend.service;

import com.pradnyesh.emergencybackend.entity.EmergencyRequest;
import org.springframework.stereotype.Service;

@Service
public class EmergencyPriorityService {

    public String calculatePriority(EmergencyRequest emergencyRequest) {
        if (emergencyRequest == null) {
            return "LOW";
        }
        return calculatePriorityFromType(emergencyRequest.getEmergencyType());
    }

    public String calculatePriorityFromType(String emergencyType) {
        if (emergencyType == null || emergencyType.trim().isEmpty()) {
            return "MEDIUM";
        }

        String normalized = emergencyType.toLowerCase().trim();

        // Rule-based intelligent decision engine

        // 1. CRITICAL Priority Keywords
        if (normalized.contains("cardiac") ||
            normalized.contains("heart attack") ||
            normalized.contains("unconscious") ||
            normalized.contains("stroke") ||
            normalized.contains("severe accident") ||
            normalized.contains("major trauma") ||
            normalized.contains("choking") ||
            normalized.contains("head injury") ||
            normalized.contains("life-threatening") ||
            normalized.contains("critical")) {
            return "CRITICAL";
        }

        // 2. HIGH Priority Keywords
        if (normalized.contains("serious") ||
            normalized.contains("breathing") ||
            normalized.contains("respiratory") ||
            normalized.contains("bleeding") ||
            normalized.contains("fracture") ||
            normalized.contains("burn") ||
            normalized.contains("chest pain") ||
            normalized.contains("seizure") ||
            normalized.contains("accident")) {
            return "HIGH";
        }

        // 3. MEDIUM Priority Keywords
        if (normalized.contains("moderate") ||
            normalized.contains("pain") ||
            normalized.contains("fever") ||
            normalized.contains("fall") ||
            normalized.contains("injury") ||
            normalized.contains("asthma") ||
            normalized.contains("diabetic") ||
            normalized.contains("abdominal")) {
            return "MEDIUM";
        }

        // 4. LOW Priority (default / routine / minor)
        return "LOW";
    }
}
