package com.pradnyesh.emergencybackend.controller;

import com.pradnyesh.emergencybackend.entity.EmergencyRequest;
import com.pradnyesh.emergencybackend.service.EmergencyRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyRequestController {

    private final EmergencyRequestService emergencyRequestService;

    public EmergencyRequestController(EmergencyRequestService emergencyRequestService) {
        this.emergencyRequestService = emergencyRequestService;
    }

    @PostMapping
    public ResponseEntity<EmergencyRequest> createEmergencyRequest(@RequestBody EmergencyRequest emergencyRequest) {
        EmergencyRequest createdRequest = emergencyRequestService.createEmergencyRequest(emergencyRequest);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmergencyRequest>> getAllEmergencyRequests() {
        List<EmergencyRequest> requests = emergencyRequestService.getAllEmergencyRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyRequest> getEmergencyRequestById(@PathVariable Long id) {
        Optional<EmergencyRequest> emergencyRequest = emergencyRequestService.getEmergencyRequestById(id);
        return emergencyRequest
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmergencyRequestById(@PathVariable Long id) {
        boolean deleted = emergencyRequestService.deleteEmergencyRequestById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
