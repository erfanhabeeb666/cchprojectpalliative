package com.erfan.cch.Dto;

import org.springframework.data.domain.Page;

public class VisitPageResponseDTO {
    private Page<PatientVisitReportDto> visits;
    private int newPatientsCount;

    public Page<PatientVisitReportDto> getVisits() {
        return visits;
    }

    public void setVisits(Page<PatientVisitReportDto> visits) {
        this.visits = visits;
    }

    public int getNewPatientsCount() {
        return newPatientsCount;
    }

    public void setNewPatientsCount(int newPatientsCount) {
        this.newPatientsCount = newPatientsCount;
    }
}
