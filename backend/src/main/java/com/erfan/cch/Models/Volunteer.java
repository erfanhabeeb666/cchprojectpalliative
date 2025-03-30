package com.erfan.cch.Models;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@DiscriminatorValue("VOLUNTEER")
public class Volunteer extends User {
    private String name;
    private String phoneNumber;
    private String address;
    private String specialization; // Example: "Nurse", "Physiotherapist"

    public Volunteer() {

    }


    public Volunteer(Long id, String name, String email, String password, String phoneNumber, String address, String specialization) {
        super(id, name, email, password);
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.specialization = specialization;
    }
}

