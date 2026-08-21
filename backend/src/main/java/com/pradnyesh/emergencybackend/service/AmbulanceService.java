package com.pradnyesh.emergencybackend.service;

import com.pradnyesh.emergencybackend.entity.Ambulance;
import com.pradnyesh.emergencybackend.repository.AmbulanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AmbulanceService {

    private final AmbulanceRepository ambulanceRepository;

    public AmbulanceService(AmbulanceRepository ambulanceRepository) {
        this.ambulanceRepository = ambulanceRepository;
    }

    public Ambulance createAmbulance(Ambulance ambulance) {
        return ambulanceRepository.save(ambulance);
    }

    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }

    public Optional<Ambulance> getAmbulanceById(Long id) {
        return ambulanceRepository.findById(id);
    }

    public Optional<Ambulance> updateAmbulance(Long id, Ambulance updatedAmbulance) {
        return ambulanceRepository.findById(id).map(existingAmbulance -> {
            if (updatedAmbulance.getAmbulanceNumber() != null) {
                existingAmbulance.setAmbulanceNumber(updatedAmbulance.getAmbulanceNumber());
            }
            if (updatedAmbulance.getDriverName() != null) {
                existingAmbulance.setDriverName(updatedAmbulance.getDriverName());
            }
            if (updatedAmbulance.getDriverPhone() != null) {
                existingAmbulance.setDriverPhone(updatedAmbulance.getDriverPhone());
            }
            if (updatedAmbulance.getAmbulanceType() != null) {
                existingAmbulance.setAmbulanceType(updatedAmbulance.getAmbulanceType());
            }
            if (updatedAmbulance.getStatus() != null) {
                existingAmbulance.setStatus(updatedAmbulance.getStatus());
            }
            existingAmbulance.setLatitude(updatedAmbulance.getLatitude());
            existingAmbulance.setLongitude(updatedAmbulance.getLongitude());
            return ambulanceRepository.save(existingAmbulance);
        });
    }

    public boolean deleteAmbulance(Long id) {
        if (ambulanceRepository.existsById(id)) {
            ambulanceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Ambulance> getAvailableAmbulances() {
        return ambulanceRepository.findByStatus("AVAILABLE");
    }
}
