package com.erfan.cch.Dto;

import com.erfan.cch.Enums.Status;

import java.util.List;
import java.util.Map;

public class VisitReportRequest {

    private List<Long> procedureIds;
    private Map<String, Integer> consumables;
    private Status status; // Assuming Status is an enum


    public List<Long> getProcedureIds() {
        return procedureIds;
    }

    public void setProcedureIds(List<Long> procedureIds) {
        this.procedureIds = procedureIds;
    }

    public Map<String, Integer> getConsumables() {
        return consumables;
    }

    public void setConsumables(Map<String, Integer> consumables) {
        this.consumables = consumables;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
