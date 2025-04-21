package com.erfan.cch.Dto;

public class ProcedureDoneDto {
    private String procedureId;
    private String procedureName;
    public ProcedureDoneDto() {

    }
    public ProcedureDoneDto(String procedureId, String procedureName) {
        this.procedureId = procedureId;
        this.procedureName = procedureName;
    }
    public String getProcedureId() {
        return procedureId;
    }
    public void setProcedureId(String procedureId) {
        this.procedureId = procedureId;
    }
    public String getProcedureName() {
        return procedureName;
    }
    public void setProcedureName(String procedureName) {
        this.procedureName = procedureName;
    }
}
