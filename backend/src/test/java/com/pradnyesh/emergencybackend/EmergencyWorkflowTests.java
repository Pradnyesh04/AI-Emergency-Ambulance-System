package com.pradnyesh.emergencybackend;

import com.pradnyesh.emergencybackend.entity.Ambulance;
import com.pradnyesh.emergencybackend.entity.Assignment;
import com.pradnyesh.emergencybackend.entity.EmergencyRequest;
import com.pradnyesh.emergencybackend.repository.AmbulanceRepository;
import com.pradnyesh.emergencybackend.repository.AssignmentRepository;
import com.pradnyesh.emergencybackend.repository.EmergencyRequestRepository;
import com.pradnyesh.emergencybackend.service.AmbulanceService;
import com.pradnyesh.emergencybackend.service.AssignmentService;
import com.pradnyesh.emergencybackend.service.EmergencyRequestService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class EmergencyWorkflowTests {

    @Autowired
    private EmergencyRequestService emergencyRequestService;

    @Autowired
    private EmergencyRequestRepository emergencyRequestRepository;

    @Autowired
    private AmbulanceService ambulanceService;

    @Autowired
    private AmbulanceRepository ambulanceRepository;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @BeforeEach
    void setUp() {
        assignmentRepository.deleteAll();
        emergencyRequestRepository.deleteAll();
        ambulanceRepository.deleteAll();
    }

    @Test
    void testEmergencyCreation_NoAvailableAmbulance_RemainsPending() {
        EmergencyRequest request = new EmergencyRequest("John Doe", "9876543210", "Cardiac", "18.5204, 73.8567", "PENDING", 18.5204, 73.8567);
        EmergencyRequest created = emergencyRequestService.createEmergencyRequest(request);

        assertNotNull(created.getId());
        assertEquals("PENDING", created.getStatus());
        assertTrue(assignmentRepository.findAll().isEmpty());
    }

    @Test
    void testEmergencyCreation_WithAvailableAmbulance_AutoAssignsNearest() {
        // Ambulance 1: Far away (Mumbai)
        Ambulance farAmbulance = new Ambulance("MH-12-AB-1000", "Far Driver", "9000000001", "ICU", "AVAILABLE", 19.0760, 72.8777);
        ambulanceService.createAmbulance(farAmbulance);

        // Ambulance 2: Near (Pune)
        Ambulance nearAmbulance = new Ambulance("MH-12-AB-2000", "Near Driver", "9000000002", "Basic", "AVAILABLE", 18.5200, 73.8560);
        Ambulance savedNear = ambulanceService.createAmbulance(nearAmbulance);

        // Emergency Request in Pune
        EmergencyRequest request = new EmergencyRequest("Jane Doe", "9876543211", "Accident", "18.5204, 73.8567", "PENDING", 18.5204, 73.8567);
        EmergencyRequest created = emergencyRequestService.createEmergencyRequest(request);

        assertEquals("ASSIGNED", created.getStatus());

        // Verify assignment created for nearest ambulance
        var assignments = assignmentRepository.findAll();
        assertEquals(1, assignments.size());
        Assignment assignment = assignments.get(0);
        assertEquals(savedNear.getId(), assignment.getAmbulanceId());
        assertEquals("ASSIGNED", assignment.getStatus());

        // Verify nearest ambulance status changed to ASSIGNED
        Ambulance updatedNearAmbulance = ambulanceRepository.findById(savedNear.getId()).orElseThrow();
        assertEquals("ASSIGNED", updatedNearAmbulance.getStatus());
    }

    @Test
    void testWorkflow_InProgress_Completed_FreesAmbulance() {
        Ambulance ambulance = ambulanceService.createAmbulance(new Ambulance("MH-12-AB-3000", "Driver 3", "9000000003", "Basic", "AVAILABLE", 18.5204, 73.8567));
        EmergencyRequest request = emergencyRequestService.createEmergencyRequest(new EmergencyRequest("Test Patient", "9999999999", "Critical", "18.5204, 73.8567", "PENDING", 18.5204, 73.8567));

        Assignment assignment = assignmentRepository.findAll().get(0);
        assertEquals("ASSIGNED", assignment.getStatus());

        // Transition 1: IN_PROGRESS
        Optional<Assignment> inProgressOpt = assignmentService.updateAssignmentStatus(assignment.getId(), "IN_PROGRESS");
        assertTrue(inProgressOpt.isPresent());
        assertEquals("IN_PROGRESS", inProgressOpt.get().getStatus());

        Ambulance busyAmbulance = ambulanceRepository.findById(ambulance.getId()).orElseThrow();
        assertEquals("BUSY", busyAmbulance.getStatus());

        EmergencyRequest inProgressRequest = emergencyRequestRepository.findById(request.getId()).orElseThrow();
        assertEquals("IN_PROGRESS", inProgressRequest.getStatus());

        // Transition 2: COMPLETED
        Optional<Assignment> completedOpt = assignmentService.updateAssignmentStatus(assignment.getId(), "COMPLETED");
        assertTrue(completedOpt.isPresent());
        assertEquals("COMPLETED", completedOpt.get().getStatus());
        assertNotNull(completedOpt.get().getCompletedAt());

        Ambulance freedAmbulance = ambulanceRepository.findById(ambulance.getId()).orElseThrow();
        assertEquals("AVAILABLE", freedAmbulance.getStatus());

        EmergencyRequest completedRequest = emergencyRequestRepository.findById(request.getId()).orElseThrow();
        assertEquals("COMPLETED", completedRequest.getStatus());
    }
}
