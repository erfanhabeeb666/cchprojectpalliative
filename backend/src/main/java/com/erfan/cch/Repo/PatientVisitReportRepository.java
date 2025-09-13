package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.PatientVisitReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface PatientVisitReportRepository extends JpaRepository<PatientVisitReport, Long>, JpaSpecificationExecutor<PatientVisitReport> {
    List<PatientVisitReport> findByVolunteerIdAndVisitDate(Long volunteerId, LocalDate visitDate);

    List<PatientVisitReport> findByVolunteerIdAndStatus(Long volunteerId, Status status);
    Long countByStatus(Status status);
    List<PatientVisitReport> findByStatus(Status status);
}

