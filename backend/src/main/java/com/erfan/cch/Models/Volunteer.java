package com.erfan.cch.Models;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;


@Entity
@DiscriminatorValue("VOLUNTEER")
public class Volunteer extends User {
    private String mobileNumber;
    private String address;
    private String specialization; // Example: "Nurse", "Physiotherapist"

    public Volunteer() {

    }



    public String getPhoneNumber() {
        return mobileNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.mobileNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Volunteer(Long id, String name, String email, String password, String phoneNumber, String address, String specialization) {
        super(id, name, email, password);
        this.mobileNumber = phoneNumber;
        this.address = address;
        this.specialization = specialization;
    }
}

