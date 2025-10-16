package com.erfan.cch.Dto;

import com.erfan.cch.Enums.Status;

import java.util.List;
import java.util.Map;

public class VisitReportRequest {
    private Long visitId;
    private List<Long> procedureIds;
    private List<ConsumableUsageDto> consumables;
    private Status status;
    private String notes;

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public  Long getVisitId() {
        return visitId;
    }
    public void setVisitId(Long visitId) {
        this.visitId = visitId;
    }

    public List<Long> getProcedureIds() {
        return procedureIds;
    }

    public void setProcedureIds(List<Long> procedureIds) {
        this.procedureIds = procedureIds;
    }

    public List<ConsumableUsageDto> getConsumables() {
        return consumables;
    }

    public void setConsumables(List<ConsumableUsageDto> consumables) {
        this.consumables = consumables;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
