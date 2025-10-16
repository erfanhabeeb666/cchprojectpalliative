package com.erfan.cch.Services;

import com.erfan.cch.Dto.ConsumableUsageDto;
import com.erfan.cch.Dto.PatientVisitReportDto;
import com.erfan.cch.Dto.ProcedureDoneDto;
import com.erfan.cch.Dto.VolunteerDashboardStatsDto;
import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.Consumable;
import com.erfan.cch.Models.PatientVisitReport;
import com.erfan.cch.Models.ProcedureDone;
import com.erfan.cch.Models.VisitConsumableUsage;
import com.erfan.cch.Repo.ConsumableRepository;
import com.erfan.cch.Repo.PatientVisitReportRepository;
import com.erfan.cch.Repo.ProcedureRepository;
import com.erfan.cch.Repo.VolunteerRepository;
import com.erfan.cch.Security.JwtService;
import com.erfan.cch.Security.JwtUtils;
import com.erfan.cch.utils.ConvertToDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VolunteerService {
    private final PatientVisitReportRepository reportRepository;
    private ConsumableRepository consumableRepository;

    private final JwtService jwtService;

   private final JwtUtils jwtUtils;

    private final HttpServletRequest request;

    private VolunteerRepository volunteerRepository;
    @Autowired
    private PatientVisitReportRepository patientVisitReportRepository;

    public VolunteerService(PatientVisitReportRepository reportRepository, ConsumableRepository consumableRepository, JwtService jwtService, JwtUtils jwtUtils, HttpServletRequest request, VolunteerRepository volunteerRepository) {
        this.reportRepository = reportRepository;
        this.consumableRepository = consumableRepository;
        this.jwtService = jwtService;
        this.jwtUtils = jwtUtils;
        this.request = request;
        this.volunteerRepository = volunteerRepository;
    }

    @Autowired
    private ProcedureRepository procedureRepository;

    public List<ProcedureDoneDto> getAllProcedures() {
        return procedureRepository.findAllByStatus(Status.ACTIVE)
                .stream()
                .map(ConvertToDto::convertToProcedureDoneDto)
                .collect(Collectors.toList());
    }

    public List<PatientVisitReportDto> getTodaysAssignedVisits() {
        Long jwtUserId = Long.valueOf(jwtService.extractId(jwtUtils.getJwtFromRequest(request)));
        LocalDate today = LocalDate.now();
            return patientVisitReportRepository.findByVolunteerIdAndVisitDate(jwtUserId,today)
                    .stream()
                    .map(ConvertToDto::convertToPatientVisitReportDto)
                    .collect(Collectors.toList());
    }
    @Transactional
    public void submitVisitReport(Long visitId, List<Long> procedureIds, List<ConsumableUsageDto> consumableUsage, Status status,String notes) {
        PatientVisitReport report = reportRepository.findById(visitId)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        report.setStatus(status);
        report.setCompletedDate(LocalDate.now());
        report.setNotes(notes);
        // Set procedures
        List<ProcedureDone> procedureDones = procedureRepository.findAllById(procedureIds);
        report.setProceduresDone(procedureDones);

        // Clear old consumables and rebuild
        report.getConsumablesUsed().clear();

        for (ConsumableUsageDto usageDto : consumableUsage) {

            Long consumableId = usageDto.getConsumableId();
            Integer qtyUsed = usageDto.getQuantity();
            System.out.println("ConsumableId: " + consumableId + " QtyUsed: " + qtyUsed);
            Consumable consumable = consumableRepository.findById(consumableId)
                    .orElseThrow(() -> new RuntimeException("Consumable not found"));

            if (consumable.getStockQuantity() < qtyUsed) {
                throw new RuntimeException("Not enough stock for consumable: " + consumable.getName());
            }

            // Subtract stock
            consumable.setStockQuantity(consumable.getStockQuantity() - qtyUsed);
            consumableRepository.saveAndFlush(consumable);



            // Create usage record
            VisitConsumableUsage usage = new VisitConsumableUsage();
            usage.setVisitReport(report);
            usage.setConsumable(consumable);
            usage.setQuantityUsed(qtyUsed);

            report.getConsumablesUsed().add(usage);
        }

        reportRepository.save(report);
    }



    public Page<PatientVisitReportDto> getCompletedAndCancelledVisits(int page, int size) {
        Long jwtUserId = Long.valueOf(jwtService.extractId(jwtUtils.getJwtFromRequest(request)));
        Pageable pageable = PageRequest.of(page, size, Sort.by("visitDate").descending());
        return patientVisitReportRepository
                .findByVolunteerIdAndStatusIn(jwtUserId, List.of(Status.COMPLETED, Status.CANCELLED), pageable)
                .map(ConvertToDto::convertToPatientVisitReportDto);
    }

    public List<Consumable> getAllConsumables() {
        return consumableRepository.findAllByStatus(Status.ACTIVE);
    }
    public VolunteerDashboardStatsDto getDashboardStats() {
        Long volunteerId = Long.valueOf(jwtService.extractId(jwtUtils.getJwtFromRequest(request)));
        long todayVisits = reportRepository.countTodayVisits(volunteerId, LocalDate.now());
        long completedVisits = reportRepository.countByVolunteerAndStatus(volunteerId, Status.COMPLETED);
        return new VolunteerDashboardStatsDto(todayVisits, completedVisits);
    }
}

