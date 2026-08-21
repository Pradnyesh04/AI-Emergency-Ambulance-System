package com.pradnyesh.emergencybackend.service;

import com.pradnyesh.emergencybackend.entity.EmergencyRequest;
import com.pradnyesh.emergencybackend.repository.EmergencyRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmergencyRequestService {

    private final EmergencyRequestRepository emergencyRequestRepository;
    private final AssignmentService assignmentService;

    public EmergencyRequestService(EmergencyRequestRepository emergencyRequestRepository,
                                  AssignmentService assignmentService) {
        this.emergencyRequestRepository = emergencyRequestRepository;
        this.assignmentService = assignmentService;
    }

    public EmergencyRequest createEmergencyRequest(EmergencyRequest emergencyRequest) {
        if (emergencyRequest.getCreatedAt() == null) {
            emergencyRequest.setCreatedAt(LocalDateTime.now());
        }
        if (emergencyRequest.getStatus() == null || emergencyRequest.getStatus().trim().isEmpty()) {
            emergencyRequest.setStatus("PENDING");
        }

        EmergencyRequest savedRequest = emergencyRequestRepository.save(emergencyRequest);

        // Attempt automatic ambulance assignment upon emergency creation
        assignmentService.autoAssignAmbulance(savedRequest.getId());

        // Return updated request status (ASSIGNED if ambulance was found, or PENDING if none available)
        return emergencyRequestRepository.findById(savedRequest.getId()).orElse(savedRequest);
    }

    public List<EmergencyRequest> getAllEmergencyRequests() {
        return emergencyRequestRepository.findAll();
    }

    public Optional<EmergencyRequest> getEmergencyRequestById(Long id) {
        return emergencyRequestRepository.findById(id);
    }

    public boolean deleteEmergencyRequestById(Long id) {
        if (emergencyRequestRepository.existsById(id)) {
            emergencyRequestRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
