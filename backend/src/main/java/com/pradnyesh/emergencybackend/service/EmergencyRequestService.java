package com.pradnyesh.emergencybackend.service;

import com.pradnyesh.emergencybackend.entity.EmergencyRequest;
import com.pradnyesh.emergencybackend.repository.EmergencyRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmergencyRequestService {

    private final EmergencyRequestRepository emergencyRequestRepository;

    public EmergencyRequestService(EmergencyRequestRepository emergencyRequestRepository) {
        this.emergencyRequestRepository = emergencyRequestRepository;
    }

    public EmergencyRequest createEmergencyRequest(EmergencyRequest emergencyRequest) {
        return emergencyRequestRepository.save(emergencyRequest);
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
