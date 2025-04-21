package com.erfan.cch.Controllers;

import com.erfan.cch.Dto.PatientVisitReportDto;
import com.erfan.cch.Dto.VisitReportRequest;
import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.PatientVisitReport;
import com.erfan.cch.Services.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/volunteer")
@PreAuthorize("hasAuthority('VOLUNTEER')")
public class VolunteerController {

    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    @PostMapping("/submit-report")
    public ResponseEntity<String> submitReport(
             @RequestParam Long visitId,
             @RequestBody VisitReportRequest reportRequest) {
        volunteerService.submitVisitReport(visitId, reportRequest.getProcedureIds(), reportRequest.getConsumables(), reportRequest.getStatus());
        return ResponseEntity.ok("Visit report submitted successfully");
    }
    
    @GetMapping("/assigned-visits")
    public ResponseEntity<List<PatientVisitReportDto>> getTodaysAssignedVisits() {
        return ResponseEntity.ok(volunteerService.getTodaysAssignedVisits());
    }
    @GetMapping("/completed-visits")
    public ResponseEntity<List<PatientVisitReportDto>> getCompletedVisits(@RequestParam Long volunteerId) {
        return ResponseEntity.ok(volunteerService.getCompletedVisits(volunteerId));
    }
}

