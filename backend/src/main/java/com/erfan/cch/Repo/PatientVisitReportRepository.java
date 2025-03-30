package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.PatientVisitReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PatientVisitReportRepository extends JpaRepository<PatientVisitReport, Long> {
    List<PatientVisitReport> findByVolunteerIdAndVisitDate(Long volunteerId, LocalDate visitDate);

    List<PatientVisitReport> findByVolunteerIdAndStatus(Long volunteerId, Status status);
}

