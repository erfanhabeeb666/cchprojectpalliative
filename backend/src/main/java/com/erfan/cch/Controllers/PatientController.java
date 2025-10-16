package com.erfan.cch.Controllers;

import com.erfan.cch.Dto.PatientLocationDto;
import com.erfan.cch.Services.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PutMapping("/{id}/location")
    public ResponseEntity<PatientLocationDto> updateLocation(
            @PathVariable Long id,
            @RequestBody PatientLocationDto dto) {
        return ResponseEntity.ok(patientService.updateLocation(id, dto));
    }
}
