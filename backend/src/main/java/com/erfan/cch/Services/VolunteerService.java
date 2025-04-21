package com.erfan.cch.Services;

import com.erfan.cch.Dto.PatientVisitReportDto;
import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.PatientVisitReport;
import com.erfan.cch.Models.ProcedureDone;
import com.erfan.cch.Repo.PatientVisitReportRepository;
import com.erfan.cch.Repo.ProcedureRepository;
import com.erfan.cch.Repo.VolunteerRepository;
import com.erfan.cch.Security.JwtService;
import com.erfan.cch.Security.JwtUtils;
import com.erfan.cch.utils.ConvertToDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VolunteerService {
    private PatientVisitReportRepository reportRepository;


    private JwtService jwtService;

   private  JwtUtils jwtUtils;

    private final HttpServletRequest request;

    private VolunteerRepository volunteerRepository;
    @Autowired
    private PatientVisitReportRepository patientVisitReportRepository;

    public VolunteerService(PatientVisitReportRepository reportRepository, JwtService jwtService, JwtUtils jwtUtils, HttpServletRequest request, VolunteerRepository volunteerRepository) {
        this.reportRepository = reportRepository;
        this.jwtService = jwtService;
        this.jwtUtils = jwtUtils;
        this.request = request;
        this.volunteerRepository = volunteerRepository;
    }

    @Autowired
    private ProcedureRepository procedureRepository;



    public List<PatientVisitReportDto> getTodaysAssignedVisits() {
        Long jwtUserId = Long.valueOf(jwtService.extractId(jwtUtils.getJwtFromRequest(request)));
        LocalDate today = LocalDate.now();
            return patientVisitReportRepository.findByVolunteerIdAndVisitDate(jwtUserId,today)
                    .stream()
                    .map(ConvertToDto::convertToPatientVisitReportDto)
                    .collect(Collectors.toList());
    }

    public void submitVisitReport(Long visitId, List<Long> procedureIds, Map<String, Integer> consumables,Status status) {
        PatientVisitReport report = reportRepository.getById(visitId);
        report.setStatus(status);
        report.setCompletedDate(LocalDate.now());
        List<ProcedureDone> procedureDones = procedureRepository.findAllById(procedureIds);
        report.setProceduresDone(procedureDones);
        report.setConsumablesUsed(consumables);
        reportRepository.save(report);
    }

    public List<PatientVisitReportDto> getCompletedVisits(Long volunteerId) {
        Long jwtUserId = Long.valueOf(jwtService.extractId(jwtUtils.getJwtFromRequest(request)));
        return patientVisitReportRepository.findByVolunteerIdAndStatus(jwtUserId,Status.COMPLETED)
                    .stream()
                    .map(ConvertToDto::convertToPatientVisitReportDto)
                    .collect(Collectors.toList());
    }
}

