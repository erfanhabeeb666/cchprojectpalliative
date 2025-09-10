package com.erfan.cch.Models;


import com.erfan.cch.Enums.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity

public class Patient {
    private String name;
    private Long mobileNumber;
    private int age;
    private String gender;
    private String address;
    private String medicalCondition; // Example: "Cancer, Stage 4"
    private String emergencyContact;
    private Status status;

    @OneToMany(mappedBy = "patient")
    private List<PatientVisitReport> visitReports;

    @OneToMany(mappedBy = "allocatedTo")
    private List<Equipment> allocatedEquipment;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(Long mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getMedicalCondition() {
        return medicalCondition;
    }

    public void setMedicalCondition(String medicalCondition) {
        this.medicalCondition = medicalCondition;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public List<PatientVisitReport> getVisitReports() {
        return visitReports;
    }

    public void setVisitReports(List<PatientVisitReport> visitReports) {
        this.visitReports = visitReports;
    }

    public List<Equipment> getAllocatedEquipment() {
        return allocatedEquipment;
    }

    public void setAllocatedEquipment(List<Equipment> allocatedEquipment) {
        this.allocatedEquipment = allocatedEquipment;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}

