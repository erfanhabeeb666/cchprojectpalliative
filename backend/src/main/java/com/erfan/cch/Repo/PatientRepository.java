package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {


    public List<Patient> findByStatus(Status status);
}
