package com.erfan.cch.Services;

import com.erfan.cch.Dto.PatientLocationDto;
import com.erfan.cch.Models.Patient;
import com.erfan.cch.Repo.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientLocationDto updateLocation(Long id, PatientLocationDto dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setLatitude(dto.getLatitude());
        patient.setLongitude(dto.getLongitude());
        patient.setAddress(dto.getAddress());

        patientRepository.save(patient);

        return dto;
    }
}
