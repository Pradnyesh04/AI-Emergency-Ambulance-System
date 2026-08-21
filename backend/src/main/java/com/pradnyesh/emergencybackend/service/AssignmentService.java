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
        if (assignment.getStatus() == null || assignment.getStatus().trim().isEmpty()) {
            assignment.setStatus("ASSIGNED");
        }

        if (assignment.getAmbulanceId() != null) {
            ambulanceRepository.findById(assignment.getAmbulanceId()).ifPresent(ambulance -> {
                if ("AVAILABLE".equalsIgnoreCase(ambulance.getStatus())) {
                    ambulance.setStatus("ASSIGNED");
                    ambulanceRepository.save(ambulance);
                }
            });
        }

        if (assignment.getEmergencyRequestId() != null) {
            emergencyRequestRepository.findById(assignment.getEmergencyRequestId()).ifPresent(req -> {
                req.setStatus("ASSIGNED");
                emergencyRequestRepository.save(req);
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
            String upperStatus = status != null ? status.trim().toUpperCase() : "ASSIGNED";
            assignment.setStatus(upperStatus);

            if ("COMPLETED".equals(upperStatus) || "CANCELLED".equals(upperStatus)) {
                if (assignment.getCompletedAt() == null) {
                    assignment.setCompletedAt(LocalDateTime.now());
                }
            }

            if (assignment.getEmergencyRequestId() != null) {
                emergencyRequestRepository.findById(assignment.getEmergencyRequestId()).ifPresent(req -> {
                    req.setStatus(upperStatus);
                    emergencyRequestRepository.save(req);
                });
            }

            if (assignment.getAmbulanceId() != null) {
                ambulanceRepository.findById(assignment.getAmbulanceId()).ifPresent(amb -> {
                    switch (upperStatus) {
                        case "ASSIGNED":
                            amb.setStatus("ASSIGNED");
                            break;
                        case "IN_PROGRESS":
                            amb.setStatus("BUSY");
                            break;
                        case "COMPLETED":
                        case "CANCELLED":
                            amb.setStatus("AVAILABLE");
                            break;
                    }
                    ambulanceRepository.save(amb);
                });
            }

            return assignmentRepository.save(assignment);
        });
    }

    public boolean deleteAssignment(Long id) {
        Optional<Assignment> assignmentOptional = assignmentRepository.findById(id);
        if (assignmentOptional.isPresent()) {
            Assignment assignment = assignmentOptional.get();
            if (("ASSIGNED".equalsIgnoreCase(assignment.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(assignment.getStatus()))
                    && assignment.getAmbulanceId() != null) {
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

        List<Assignment> existingAssignments = assignmentRepository.findByEmergencyRequestId(emergencyRequestId);
        for (Assignment existing : existingAssignments) {
            if ("ASSIGNED".equalsIgnoreCase(existing.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(existing.getStatus())) {
                return Optional.of(existing);
            }
        }

        double lat = emergencyRequest.getLatitude();
        double lon = emergencyRequest.getLongitude();

        Optional<Ambulance> nearestAmbulanceOpt = ambulanceService.findNearestAvailableAmbulance(lat, lon);
        if (nearestAmbulanceOpt.isEmpty()) {
            return Optional.empty();
        }

        Ambulance ambulance = nearestAmbulanceOpt.get();
        if (!"AVAILABLE".equalsIgnoreCase(ambulance.getStatus())) {
            return Optional.empty();
        }

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
