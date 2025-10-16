package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.PatientVisitReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

public interface PatientVisitReportRepository extends JpaRepository<PatientVisitReport, Long>, JpaSpecificationExecutor<PatientVisitReport> {
    List<PatientVisitReport> findByVolunteerIdAndVisitDate(Long volunteerId, LocalDate visitDate);

    List<PatientVisitReport> findByVolunteerIdAndStatus(Long volunteerId, Status status);
    Long countByStatus(Status status);

    boolean existsByPatientIdAndVisitDate(Long patientId, LocalDate visitDate);

    List<PatientVisitReport> findByVisitDateBefore(LocalDate endDate);

    List<PatientVisitReport> findByVisitDateBetween(LocalDate startDate, LocalDate endDate);

    List<PatientVisitReport> findByVisitDateAfter(LocalDate startDate);
    @Query("SELECT COUNT(v) FROM PatientVisitReport v WHERE v.volunteer.id = :volunteerId AND v.visitDate = :today")
    long countTodayVisits(Long volunteerId, LocalDate today);

    @Query("SELECT COUNT(v) FROM PatientVisitReport v WHERE v.volunteer.id = :volunteerId AND v.status = :status")
    long countByVolunteerAndStatus(Long volunteerId, Status status);

    Page<PatientVisitReport> findByVolunteerIdAndStatusIn(Long volunteerId, Collection<Status> statuses, Pageable pageable);
}

