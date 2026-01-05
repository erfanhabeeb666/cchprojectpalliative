package com.erfan.cch.utils;

import com.erfan.cch.Dto.*;
import com.erfan.cch.Models.*;

import java.util.List;
import java.util.stream.Collectors;

public class ConvertToDto {

    public static  ProcedureDoneDto convertToProcedureDoneDto(ProcedureDone procedureDone) {
        ProcedureDoneDto dto = new ProcedureDoneDto();
        dto.setProcedureId(String.valueOf(procedureDone.getId()));
        dto.setProcedureName(procedureDone.getName());
        return dto;
    }
    public static VolunteerDto convertToVolunteerDto(Volunteer volunteer) {
        VolunteerDto dto = new VolunteerDto();
        dto.setId(volunteer.getId());
        dto.setName(volunteer.getName());
        dto.setEmail(volunteer.getEmail());
        dto.setPhoneNumber(volunteer.getPhoneNumber());
        dto.setAddress(volunteer.getAddress());
        dto.setSpecialization(volunteer.getSpecialization());
        return dto;
    }
    public static PatientDto convertToPatientDto(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setName(patient.getName());
        dto.setMobileNumber(patient.getMobileNumber());
        dto.setAge(patient.getAge());
        dto.setGender(patient.getGender());
        dto.setAddress(patient.getAddress());
        dto.setMedicalCondition(patient.getMedicalCondition());
        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setLatitude(patient.getLatitude());
        dto.setLongitude(patient.getLongitude());
        dto.setAlivestatus(patient.getAlivestatus());
        dto.setDate(patient.getDate());
        return dto;
    }
    public static EquipmentDto convertToEquipmentDto(Equipment equipment) {
        EquipmentDto dto = new EquipmentDto();
        dto.setId(equipment.getId());
        dto.setName(equipment.getName());
        dto.setAllocated(equipment.isAllocated());
        if (equipment.getAllocatedTo() != null) {
            dto.setPatientId(equipment.getAllocatedTo().getId());
            dto.setPatientName(equipment.getAllocatedTo().getName());
        }
        return dto;
    }
    public static PatientVisitReportDto convertToPatientVisitReportDto(PatientVisitReport report) {
        PatientVisitReportDto dto = new PatientVisitReportDto();
        dto.setId(report.getId());
        dto.setNotes(report.getNotes());

        if (report.getPatient() != null) {
            dto.setPatientId(report.getPatient().getId());
            dto.setPatientName(report.getPatient().getName());
            dto.setLatitude(report.getPatient().getLatitude());
            dto.setLongitude(report.getPatient().getLongitude());
        }

        if (report.getVolunteer() != null) {
            dto.setVolunteerId(report.getVolunteer().getId());
            dto.setVolunteerName(report.getVolunteer().getName());
        }
        dto.setConsumablesUsed(report.getConsumablesUsed());
        dto.setVisitDate(report.getVisitDate());
        dto.setCompletedDate(report.getCompletedDate());
        dto.setVisitCode(report.getVisitCode());
        // Convert procedure entities to names
        if (report.getProceduresDone() != null) {
            List<String> procedureNames = report.getProceduresDone().stream()
                    .map(ProcedureDone::getName)
                    .collect(Collectors.toList());
            dto.setProceduresDone(procedureNames);
        }

        dto.setConsumablesUsed(report.getConsumablesUsed());
        dto.setStatus(report.getStatus() != null ? report.getStatus().name() : null);

        return dto;
    }


}