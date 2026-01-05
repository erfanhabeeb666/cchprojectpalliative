package com.erfan.cch.Dto;

import com.erfan.cch.Models.VisitConsumableUsage;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class PatientVisitReportDto {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long volunteerId;
    private String volunteerName;
    private LocalDate visitDate;
    private LocalDate completedDate;
    private List<String> proceduresDone; // Just names of procedures
    private List<VisitConsumableUsage> consumablesUsed;
    private String status;
    private Double latitude;
    private Double longitude;
    private String visitCode;
    private String notes;
    private String submittedBy;

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getVisitCode() {
        return visitCode;
    }

    public void setVisitCode(String visitCode) {
        this.visitCode = visitCode;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getVolunteerName() {
        return volunteerName;
    }

    public void setVolunteerName(String volunteerName) {
        this.volunteerName = volunteerName;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public LocalDate getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDate completedDate) {
        this.completedDate = completedDate;
    }

    public List<String> getProceduresDone() {
        return proceduresDone;
    }

    public void setProceduresDone(List<String> proceduresDone) {
        this.proceduresDone = proceduresDone;
    }

    public List<VisitConsumableUsage> getConsumablesUsed() {
        return consumablesUsed;
    }

    public void setConsumablesUsed(List<VisitConsumableUsage> consumablesUsed) {
        this.consumablesUsed = consumablesUsed;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
