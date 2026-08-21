package com.pradnyesh.emergencybackend.service;

import com.pradnyesh.emergencybackend.entity.Ambulance;
import com.pradnyesh.emergencybackend.entity.Assignment;
import com.pradnyesh.emergencybackend.entity.EmergencyRequest;
import com.pradnyesh.emergencybackend.repository.AmbulanceRepository;
import com.pradnyesh.emergencybackend.repository.AssignmentRepository;
import com.pradnyesh.emergencybackend.repository.EmergencyRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final EmergencyRequestRepository emergencyRequestRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final AmbulanceService ambulanceService;

    public AssignmentService(AssignmentRepository assignmentRepository,
                             EmergencyRequestRepository emergencyRequestRepository,
                             AmbulanceRepository ambulanceRepository,
                             AmbulanceService ambulanceService) {
        this.assignmentRepository = assignmentRepository;
        this.emergencyRequestRepository = emergencyRequestRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.ambulanceService = ambulanceService;
    }

    public Assignment createAssignment(Assignment assignment) {
        if (assignment.getAssignedAt() == null) {
            assignment.setAssignedAt(LocalDateTime.now());
        }
        if (assignment.getStatus() == null) {
            assignment.setStatus("ASSIGNED");
        }
        if (assignment.getAmbulanceId() != null) {
            ambulanceRepository.findById(assignment.getAmbulanceId()).ifPresent(ambulance -> {
                ambulance.setStatus("ASSIGNED");
                ambulanceRepository.save(ambulance);
            });
        }
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Optional<Assignment> updateAssignmentStatus(Long id, String status) {
        return assignmentRepository.findById(id).map(assignment -> {
            assignment.setStatus(status);
            if ("COMPLETED".equalsIgnoreCase(status) || "CANCELLED".equalsIgnoreCase(status)) {
                assignment.setCompletedAt(LocalDateTime.now());
                if (assignment.getAmbulanceId() != null) {
                    ambulanceRepository.findById(assignment.getAmbulanceId()).ifPresent(ambulance -> {
                        ambulance.setStatus("AVAILABLE");
                        ambulanceRepository.save(ambulance);
                    });
                }
            } else if ("ASSIGNED".equalsIgnoreCase(status)) {
                if (assignment.getAmbulanceId() != null) {
                    ambulanceRepository.findById(assignment.getAmbulanceId()).ifPresent(ambulance -> {
                        ambulance.setStatus("ASSIGNED");
                        ambulanceRepository.save(ambulance);
                    });
                }
            }
            return assignmentRepository.save(assignment);
        });
    }

    public boolean deleteAssignment(Long id) {
        Optional<Assignment> assignmentOptional = assignmentRepository.findById(id);
        if (assignmentOptional.isPresent()) {
            Assignment assignment = assignmentOptional.get();
            if ("ASSIGNED".equalsIgnoreCase(assignment.getStatus()) && assignment.getAmbulanceId() != null) {
                ambulanceRepository.findById(assignment.getAmbulanceId()).ifPresent(ambulance -> {
                    ambulance.setStatus("AVAILABLE");
                    ambulanceRepository.save(ambulance);
                });
            }
            assignmentRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Assignment> autoAssignAmbulance(Long emergencyRequestId) {
        Optional<EmergencyRequest> emergencyRequestOpt = emergencyRequestRepository.findById(emergencyRequestId);
        if (emergencyRequestOpt.isEmpty()) {
            return Optional.empty();
        }

        EmergencyRequest emergencyRequest = emergencyRequestOpt.get();
        double lat = emergencyRequest.getLatitude();
        double lon = emergencyRequest.getLongitude();

        Optional<Ambulance> nearestAmbulanceOpt = ambulanceService.findNearestAvailableAmbulance(lat, lon);
        if (nearestAmbulanceOpt.isEmpty()) {
            return Optional.empty();
        }

        Ambulance ambulance = nearestAmbulanceOpt.get();
        ambulance.setStatus("ASSIGNED");
        ambulanceRepository.save(ambulance);

        emergencyRequest.setStatus("ASSIGNED");
        emergencyRequestRepository.save(emergencyRequest);

        Assignment assignment = new Assignment();
        assignment.setEmergencyRequestId(emergencyRequestId);
        assignment.setAmbulanceId(ambulance.getId());
        assignment.setStatus("ASSIGNED");
        assignment.setAssignedAt(LocalDateTime.now());

        return Optional.of(assignmentRepository.save(assignment));
    }
}
