package com.pradnyesh.emergencybackend;

import com.pradnyesh.emergencybackend.dto.SmartDispatchResponse;
import com.pradnyesh.emergencybackend.entity.Ambulance;
import com.pradnyesh.emergencybackend.entity.Assignment;
import com.pradnyesh.emergencybackend.entity.EmergencyRequest;
import com.pradnyesh.emergencybackend.repository.AmbulanceRepository;
import com.pradnyesh.emergencybackend.repository.AssignmentRepository;
import com.pradnyesh.emergencybackend.repository.EmergencyRequestRepository;
import com.pradnyesh.emergencybackend.service.AmbulanceService;
import com.pradnyesh.emergencybackend.service.AssignmentService;
import com.pradnyesh.emergencybackend.service.EmergencyPriorityService;
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

    @Autowired
    private EmergencyPriorityService emergencyPriorityService;

    @BeforeEach
    void setUp() {
        assignmentRepository.deleteAll();
        emergencyRequestRepository.deleteAll();
        ambulanceRepository.deleteAll();
    }

    @Test
    void testEmergencyPriorityService_RuleBasedClassification() {
        assertEquals("CRITICAL", emergencyPriorityService.calculatePriorityFromType("Cardiac Arrest Emergency"));
        assertEquals("CRITICAL", emergencyPriorityService.calculatePriorityFromType("Unconscious patient at home"));
        assertEquals("HIGH", emergencyPriorityService.calculatePriorityFromType("Severe Bleeding & fracture"));
        assertEquals("MEDIUM", emergencyPriorityService.calculatePriorityFromType("Moderate fever & pain"));
        assertEquals("LOW", emergencyPriorityService.calculatePriorityFromType("Routine hospital checkup transfer"));
    }

    @Test
    void testEmergencyCreation_NoAvailableAmbulance_RemainsPending() {
        EmergencyRequest request = new EmergencyRequest("John Doe", "9876543210", "Cardiac", "18.5204, 73.8567", "PENDING", 18.5204, 73.8567);
        EmergencyRequest created = emergencyRequestService.createEmergencyRequest(request);

        assertNotNull(created.getId());
        assertEquals("PENDING", created.getStatus());
        assertEquals("CRITICAL", created.getPriority());
        assertTrue(assignmentRepository.findAll().isEmpty());
    }

    @Test
    void testSmartDispatch_PrefersALSForCriticalEmergency() {
        // Basic Ambulance: Slightly closer (0.1 km away)
        Ambulance basicAmbulance = new Ambulance("MH-12-BASIC", "Basic Driver", "9000000001", "BASIC", "AVAILABLE", 18.5205, 73.8568);
        ambulanceService.createAmbulance(basicAmbulance);

        // ALS/ICU Ambulance: Slightly further (1.0 km away)
        Ambulance alsAmbulance = new Ambulance("MH-12-ALS", "ALS Driver", "9000000002", "ICU / ALS", "AVAILABLE", 18.5250, 73.8590);
        Ambulance savedALS = ambulanceService.createAmbulance(alsAmbulance);

        // Critical Emergency (Cardiac Arrest)
        EmergencyRequest request = new EmergencyRequest("Cardiac Patient", "9876543211", "Cardiac Arrest", "18.5204, 73.8567", "PENDING", 18.5204, 73.8567);
        EmergencyRequest created = emergencyRequestService.createEmergencyRequest(request);

        assertEquals("ASSIGNED", created.getStatus());
        assertEquals("CRITICAL", created.getPriority());

        // Verify smart dispatch selected the ALS ambulance
        Optional<SmartDispatchResponse> smartResp = assignmentService.smartDispatch(created.getId());
        assertTrue(smartResp.isPresent());
        assertEquals(savedALS.getId(), smartResp.get().getAmbulanceId());
        assertEquals("CRITICAL", smartResp.get().getPriority());
    }

    @Test
    void testWorkflow_InProgress_Completed_FreesAmbulance() {
        Ambulance ambulance = ambulanceService.createAmbulance(new Ambulance("MH-12-AB-3000", "Driver 3", "9000000003", "Basic", "AVAILABLE", 18.5204, 73.8567));
        EmergencyRequest request = emergencyRequestService.createEmergencyRequest(new EmergencyRequest("Test Patient", "9999999999", "Critical Trauma", "18.5204, 73.8567", "PENDING", 18.5204, 73.8567));

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
