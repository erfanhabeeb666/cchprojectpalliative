package com.erfan.cch.Services;

import com.erfan.cch.Dto.*;
import com.erfan.cch.Enums.Status;
import com.erfan.cch.Enums.UserType;
import com.erfan.cch.Models.*;
import com.erfan.cch.Repo.*;
import com.erfan.cch.Security.AuthenticationService;
import com.erfan.cch.utils.ConvertToDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private PatientRepository patientRepository;


    private VolunteerRepository volunteerRepository;


    private PatientVisitReportRepository reportRepository;


    private EquipmentRepository equipmentRepository;
    private final PasswordEncoder passwordEncoder;


    private ProcedureRepository procedureRepository;

    private UserRepository userRepository;

    private AuthenticationService authenticationService;

    public AdminService(PatientRepository patientRepository, VolunteerRepository volunteerRepository, PatientVisitReportRepository reportRepository, EquipmentRepository equipmentRepository, PasswordEncoder passwordEncoder, ProcedureRepository procedureRepository, UserRepository userRepository, AuthenticationService authenticationService) {
        this.patientRepository = patientRepository;
        this.volunteerRepository = volunteerRepository;
        this.reportRepository = reportRepository;
        this.equipmentRepository = equipmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.procedureRepository = procedureRepository;
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
    }


    public void addProcedure(String name) {
        ProcedureDone procedureDone = new ProcedureDone();
        procedureDone.setName(name);
        procedureDone.setStatus(Status.ACTIVE);
        procedureRepository.save(procedureDone);
    }


    public List<ProcedureDoneDto> getAllProcedures() {
        return procedureRepository.findAllByStatus(Status.ACTIVE)
                .stream()
                .map(ConvertToDto::convertToProcedureDoneDto)
                .collect(Collectors.toList());
    }

    public void assignVolunteerToVisit(Long volunteerId, Long patientId, LocalDate visitDate) {
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Create a new visit report for assignment
        PatientVisitReport visitReport = new PatientVisitReport();
        visitReport.setVolunteer(volunteer);
        visitReport.setPatient(patient);
        visitReport.setVisitDate(visitDate);
        visitReport.setStatus(Status.PENDING);
        reportRepository.save(visitReport);
    }
    // todo
    //public List<PatientVisitReport> getConsumablesUsageReport(LocalDate startDate, LocalDate endDate) {
    //  return reportRepository.findConsumableUsage(startDate, endDate);
    //}

    public void allocateEquipment(Long equipmentId, Long patientId) {
        Equipment equipment = equipmentRepository.findById(equipmentId).get();
        Patient patient = patientRepository.findById(patientId).get();
        equipment.setAllocated(true);
        equipment.setAllocatedTo(patient);
        equipmentRepository.save(equipment);
    }

    public void deallocateEquipment(Long equipmentId) {
        Equipment equipment = equipmentRepository.findById(equipmentId).get();
        equipment.setAllocated(false);
        equipment.setAllocatedTo(null);
        equipmentRepository.save(equipment);
    }

    public void addPatient(Patient patient) {
        patient.setStatus(Status.ACTIVE);
        patientRepository.save(patient);
    }

    public void addVolunteer(Volunteer volunteer) {
        volunteer.setUserType(UserType.VOLUNTEER);
        volunteer.setStatus(Status.ACTIVE);
        volunteer.setPassword(passwordEncoder.encode(volunteer.getPassword()));
        volunteer.setSpecialization(volunteer.getSpecialization());
        volunteerRepository.save(volunteer);

    }

    public void addEquipment(Equipment equipment) {
        equipment.setAllocated(false);
        equipment.setAllocatedTo(null);
        equipmentRepository.save(equipment);
    }


    public Page<EquipmentDto> getAllEquipment(String search, Pageable pageable) {

        if (search == null || search.isEmpty()) {
            return equipmentRepository.findAll(pageable)
                    .map(ConvertToDto::convertToEquipmentDto);
        }

        // If search term exists, filter by equipment name or patient name
        return equipmentRepository.findByNameContainingIgnoreCaseOrAllocatedTo_NameContainingIgnoreCase(
                search, search, pageable
        ).map(ConvertToDto::convertToEquipmentDto);

    }
    public Page<PatientDto> getAllPatients(String search, Pageable pageable) {
        Page<Patient> patients;

        if (search == null || search.trim().isEmpty()) {
            patients = patientRepository.findByStatus(Status.ACTIVE, pageable);
        } else {
            patients = patientRepository.findByStatusAndNameContainingIgnoreCaseOrStatusAndMobileNumberContaining(
                    Status.ACTIVE, search,
                    Status.ACTIVE, search,
                    pageable
            );
        }

        return patients.map(ConvertToDto::convertToPatientDto);
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    public void deletePatient(long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        Patient actual = patient.get();
        actual.setStatus(Status.INACTIVE);
        patientRepository.save(actual);
    }

    public DashboardStatsDto dashboardStats() {
        DashboardStatsDto dashboardStatsDto = new DashboardStatsDto();
        dashboardStatsDto.setTotalPatients(patientRepository.count());
        dashboardStatsDto.setActiveVolunteers(volunteerRepository.count());
        dashboardStatsDto.setTotalVisitDone(reportRepository.countByStatus(Status.COMPLETED));
        dashboardStatsDto.setPendingVisits(reportRepository.countByStatus(Status.PENDING));
        dashboardStatsDto.setEquipmentsTotal(equipmentRepository.count());
        return dashboardStatsDto;
    }

    public List<PatientVisitReportDto> getVisits(Status status) {
        return reportRepository.findByStatus(status)
                .stream()
                .map(ConvertToDto::convertToPatientVisitReportDto)
                .collect(Collectors.toList());
    }

    public void deleteProcedure(Long id) {
        Optional<ProcedureDone> procedureDone = procedureRepository.findById(id);
        ProcedureDone actual = procedureDone.get();
        actual.setStatus(Status.INACTIVE);
        procedureRepository.save(actual);
    }

    public void deleteVolunteer(Long id) {
        Optional<Volunteer> dbVol = volunteerRepository.findById(id);
        Volunteer actual = dbVol.get();
        actual.setStatus(Status.INACTIVE);
        volunteerRepository.save(actual);
    }
    public Page<VolunteerDto> getVolunteers(String search, Pageable pageable) {
        Page<Volunteer> volunteers;

        if (search == null || search.trim().isEmpty()) {
            // ✅ No search → return all ACTIVE volunteers
            volunteers = volunteerRepository.findByStatus(Status.ACTIVE, pageable);
        } else {
            // ✅ Search by name or mobile → only ACTIVE volunteers
            volunteers = volunteerRepository.findByStatusAndNameContainingIgnoreCaseOrStatusAndMobileNumberContaining(
                    Status.ACTIVE, search,
                    Status.ACTIVE, search,
                    pageable
            );
        }

        return volunteers.map(ConvertToDto::convertToVolunteerDto);
    }

}
