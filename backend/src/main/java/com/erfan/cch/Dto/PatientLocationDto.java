package com.erfan.cch.Dto;

import lombok.Data;

@Data
public class PatientLocationDto {
    private Long patientId;
    private Double latitude;
    private Double longitude;
    private String address;
}
