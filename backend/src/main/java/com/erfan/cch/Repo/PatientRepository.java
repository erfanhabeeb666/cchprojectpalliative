package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    List<Patient> findByStatus(Status status);
    List<Patient> findByNameContainingIgnoreCaseAndStatus(String name, Status status);
    Page<Patient> findByStatus(Status status, Pageable pageable);

    Page<Patient> findByNameContainingIgnoreCaseAndStatus(String search, Status status, Pageable pageable);

    Page<Patient> findAllByStatus(Status status, Pageable pageable);

    Page<Patient> findByStatusAndNameContainingIgnoreCaseOrStatusAndMobileNumberContaining(Status status, String search, Status status1, String search1, Pageable pageable);
    boolean existsByMobileNumber(String mobileNumber);

    int countByDateBetween(LocalDate start, LocalDate end);
    int countByDateLessThanEqual(LocalDate end);
    int countByDateGreaterThanEqual(LocalDate start);
}
