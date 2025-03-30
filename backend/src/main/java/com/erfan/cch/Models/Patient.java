package com.erfan.cch.Models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Patient {
    private String name;
    private Long mobileNumber;
    private int age;
    private String gender;
    private String address;
    private String medicalCondition; // Example: "Cancer, Stage 4"
    private String emergencyContact;

    @OneToMany(mappedBy = "patient")
    private List<PatientVisitReport> visitReports;

    @OneToMany(mappedBy = "allocatedTo")
    private List<Equipment> allocatedEquipment;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

}

