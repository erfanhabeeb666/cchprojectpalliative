package com.erfan.cch.Services;

import com.erfan.cch.Dto.EquipmentDto;
import com.erfan.cch.Dto.PatientDto;
import com.erfan.cch.Dto.ProcedureDoneDto;
import com.erfan.cch.Dto.VolunteerDto;
import com.erfan.cch.Enums.Status;
import com.erfan.cch.Enums.UserType;
import com.erfan.cch.Models.*;
import com.erfan.cch.Repo.*;
import com.erfan.cch.Security.AuthenticationService;
import com.erfan.cch.utils.ConvertToDto;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
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
        procedureRepository.save(procedureDone);
    }


    public List<ProcedureDoneDto> getAllProcedures() {
        return procedureRepository.findAll()
                .stream()
                .map(ConvertToDto::convertToProcedureDoneDto)
                .collect(Collectors.toList());
    }

    public List<VolunteerDto> getVolunteers() {
        return volunteerRepository.findAll()
                .stream()
                .map(ConvertToDto::convertToVolunteerDto)
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
        patientRepository.save(patient);
    }

    public void addVolunteer(Volunteer volunteer) {
        volunteer.setUserType(UserType.VOLUNTEER);
        volunteer.setPassword(passwordEncoder.encode(volunteer.getPassword()));
        volunteer.setSpecialization(volunteer.getSpecialization());
        volunteerRepository.save(volunteer);

    }

    public void addEquipment(Equipment equipment) {
        equipment.setAllocated(false);
        equipment.setAllocatedTo(null);
        equipmentRepository.save(equipment);
    }

    public List<EquipmentDto> getAllEquipment() {
        return equipmentRepository.findAll()
                .stream()
                .map(ConvertToDto::convertToEquipmentDto)
                .collect(Collectors.toList());
    }


    public List<PatientDto> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(ConvertToDto::convertToPatientDto)
                .collect(Collectors.toList());
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    public void deletePatient(long id) {
        patientRepository.deleteById(id);
    }
}
