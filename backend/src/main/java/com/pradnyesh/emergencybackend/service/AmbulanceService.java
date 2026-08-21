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

    public Optional<Ambulance> findNearestAvailableAmbulance(double latitude, double longitude) {
        List<Ambulance> availableAmbulances = getAvailableAmbulances();

        if (availableAmbulances.isEmpty()) {
            return Optional.empty();
        }

        Ambulance nearestAmbulance = null;
        double minDistance = Double.MAX_VALUE;

        for (Ambulance ambulance : availableAmbulances) {
            double distance = calculateDistance(latitude, longitude, ambulance.getLatitude(), ambulance.getLongitude());
            if (distance < minDistance) {
                minDistance = distance;
                nearestAmbulance = ambulance;
            }
        }

        return Optional.ofNullable(nearestAmbulance);
    }

    public Optional<Ambulance> findSmartAvailableAmbulance(double latitude, double longitude, String priority) {
        List<Ambulance> availableAmbulances = getAvailableAmbulances();
        if (availableAmbulances.isEmpty()) {
            return Optional.empty();
        }

        boolean preferALS = "HIGH".equalsIgnoreCase(priority) || "CRITICAL".equalsIgnoreCase(priority);

        if (preferALS) {
            Ambulance nearestALS = null;
            double minDistanceALS = Double.MAX_VALUE;

            for (Ambulance ambulance : availableAmbulances) {
                String type = ambulance.getAmbulanceType() != null ? ambulance.getAmbulanceType().toUpperCase() : "";
                if (type.contains("ALS") || type.contains("ICU") || type.contains("ADVANCED")) {
                    double distance = calculateDistance(latitude, longitude, ambulance.getLatitude(), ambulance.getLongitude());
                    if (distance < minDistanceALS) {
                        minDistanceALS = distance;
                        nearestALS = ambulance;
                    }
                }
            }

            if (nearestALS != null) {
                return Optional.of(nearestALS);
            }
        }

        return findNearestAvailableAmbulance(latitude, longitude);
    }

    public double calculateDistanceBetween(double lat1, double lon1, double lat2, double lon2) {
        return calculateDistance(lat1, lon1, lat2, lon2);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double EARTH_RADIUS = 6371.0; // Earth's radius in kilometers

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                 * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}
