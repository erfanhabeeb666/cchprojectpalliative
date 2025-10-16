package com.erfan.cch.Dto;



import java.time.LocalDate;
import java.util.List;

public class VisitDateDto {
    LocalDate visitDate;
    List<Long> patientIds;
    Long volunteerId;

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }
    public List<Long> getPatientIds() {
        return patientIds;
    }
    public void setPatientIds(List<Long> patientId) {
        this.patientIds = patientId;
    }
    public Long getVolunteerId() {
        return volunteerId;
    }
    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }
}
