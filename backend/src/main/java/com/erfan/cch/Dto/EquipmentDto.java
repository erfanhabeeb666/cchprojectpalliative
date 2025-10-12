package com.erfan.cch.Dto;
public class EquipmentDto {
    private Long id;
    private String name;
    private boolean allocated;
    private Long patientId;
    private String patientName;
    private String EquipmentTypeName;

    public String getEquipmentTypeName() {
        return EquipmentTypeName;
    }

    public void setEquipmentTypeName(String equipmentTypeName) {
        EquipmentTypeName = equipmentTypeName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isAllocated() {
        return allocated;
    }

    public void setAllocated(boolean allocated) {
        this.allocated = allocated;
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
}
