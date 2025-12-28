package com.erfan.cch.Dto;

public class NewEquipmentRequestDto {
    private String name;
    private String equipmentTypeId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEquipmentTypeId() {
        return equipmentTypeId;
    }

    public void setEquipmentTypeId(String equipmentTypeId) {
        this.equipmentTypeId = equipmentTypeId;
    }
}
