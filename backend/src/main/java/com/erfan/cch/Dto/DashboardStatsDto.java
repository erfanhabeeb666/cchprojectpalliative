package com.erfan.cch.Dto;

public class DashboardStatsDto {
    public Long totalPatients;
    public Long activeVolunteers;
    public Long equipmentsTotal;
    public Long totalVisitDone;
    public Long pendingVisits;

    public Long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(Long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public Long getActiveVolunteers() {
        return activeVolunteers;
    }

    public void setActiveVolunteers(Long activeVolunteers) {
        this.activeVolunteers = activeVolunteers;
    }

    public Long getEquipmentsTotal() {
        return equipmentsTotal;
    }

    public void setEquipmentsTotal(Long equipmentsTotal) {
        this.equipmentsTotal = equipmentsTotal;
    }

    public Long getTotalVisitDone() {
        return totalVisitDone;
    }

    public void setTotalVisitDone(Long totalVisitDone) {
        this.totalVisitDone = totalVisitDone;
    }

    public Long getPendingVisits() {
        return pendingVisits;
    }

    public void setPendingVisits(Long pendingVisits) {
        this.pendingVisits = pendingVisits;
    }

    public DashboardStatsDto(Long totalPatients, Long activeVolunteers, Long equipmentsTotal, Long totalVisitDone, Long pendingVisits) {
        this.totalPatients = totalPatients;
        this.activeVolunteers = activeVolunteers;
        this.equipmentsTotal = equipmentsTotal;
        this.totalVisitDone = totalVisitDone;
        this.pendingVisits = pendingVisits;
    }

    public DashboardStatsDto() {
    }
}
