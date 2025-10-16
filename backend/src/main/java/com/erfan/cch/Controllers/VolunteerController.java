package com.erfan.cch.Controllers;

import com.erfan.cch.Dto.PatientVisitReportDto;
import com.erfan.cch.Dto.ProcedureDoneDto;
import com.erfan.cch.Dto.VisitReportRequest;
import com.erfan.cch.Dto.VolunteerDashboardStatsDto;
import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.Consumable;
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
    public ResponseEntity<String> submitReport(@RequestBody VisitReportRequest reportRequest) {
        volunteerService.submitVisitReport(
                reportRequest.getVisitId(),
                reportRequest.getProcedureIds(),
                reportRequest.getConsumables(),
                reportRequest.getStatus(),
                reportRequest.getNotes()
        );
        return ResponseEntity.ok("Visit report submitted successfully");
    }
    @GetMapping("/consumables")
    public ResponseEntity<List<Consumable>> getAllConsumables(){
        return ResponseEntity.ok(volunteerService.getAllConsumables());
    }


    @GetMapping("/assigned-visits")
    public ResponseEntity<List<PatientVisitReportDto>> getTodaysAssignedVisits() {
        return ResponseEntity.ok(volunteerService.getTodaysAssignedVisits());
    }
    @GetMapping("/completed-visits")
    public ResponseEntity<org.springframework.data.domain.Page<PatientVisitReportDto>> getCompletedVisits(
            @RequestParam(required = false) Long volunteerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(volunteerService.getCompletedAndCancelledVisits(page, size));
    }
    @GetMapping("/procedures")
    public ResponseEntity<List<ProcedureDoneDto>> getAllProcedures() {
        return ResponseEntity.ok(volunteerService.getAllProcedures());
    }
    @GetMapping("/dashboard")
    public ResponseEntity<VolunteerDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(volunteerService
                .getDashboardStats());
    }

}

