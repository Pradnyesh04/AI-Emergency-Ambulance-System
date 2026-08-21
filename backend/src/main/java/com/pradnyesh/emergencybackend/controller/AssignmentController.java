package com.pradnyesh.emergencybackend.controller;

import com.pradnyesh.emergencybackend.entity.Assignment;
import com.pradnyesh.emergencybackend.repository.EmergencyRequestRepository;
import com.pradnyesh.emergencybackend.service.AssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final EmergencyRequestRepository emergencyRequestRepository;

    public AssignmentController(AssignmentService assignmentService, EmergencyRequestRepository emergencyRequestRepository) {
        this.assignmentService = assignmentService;
        this.emergencyRequestRepository = emergencyRequestRepository;
    }

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        Assignment createdAssignment = assignmentService.createAssignment(assignment);
        return new ResponseEntity<>(createdAssignment, HttpStatus.CREATED);
    }

    @PostMapping("/auto/{emergencyRequestId}")
    public ResponseEntity<?> autoAssignAmbulance(@PathVariable Long emergencyRequestId) {
        if (!emergencyRequestRepository.existsById(emergencyRequestId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Emergency request not found with id: " + emergencyRequestId);
        }

        Optional<Assignment> assignmentOpt = assignmentService.autoAssignAmbulance(emergencyRequestId);
        if (assignmentOpt.isPresent()) {
            return new ResponseEntity<>(assignmentOpt.get(), HttpStatus.CREATED);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No available ambulance found");
        }
    }

    @PostMapping("/smart/{emergencyRequestId}")
    public ResponseEntity<?> smartDispatch(@PathVariable Long emergencyRequestId) {
        if (!emergencyRequestRepository.existsById(emergencyRequestId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Emergency request not found with id: " + emergencyRequestId);
        }

        return assignmentService.smartDispatch(emergencyRequestId)
                .<ResponseEntity<?>>map(response -> new ResponseEntity<>(response, HttpStatus.CREATED))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No available ambulance found for emergency request"));
    }

    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        return assignmentService.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAssignmentStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) Map<String, String> body) {

        String newStatus = status;
        if (newStatus == null && body != null && body.containsKey("status")) {
            newStatus = body.get("status");
        }
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        Optional<Assignment> updatedAssignment = assignmentService.updateAssignmentStatus(id, newStatus);
        if (updatedAssignment.isPresent()) {
            return ResponseEntity.ok(updatedAssignment.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Assignment not found with id: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        boolean deleted = assignmentService.deleteAssignment(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
