package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {


    Page<Patient> findByStatus(Status status, Pageable pageable);

    Page<Patient> findByNameContainingIgnoreCaseAndStatus(String search, Status status, Pageable pageable);

    Page<Patient> findAllByStatus(Status status, Pageable pageable);

    Page<Patient> findByStatusAndNameContainingIgnoreCaseOrStatusAndMobileNumberContaining(Status status, String search, Status status1, String search1, Pageable pageable);
}
