package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.Volunteer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    List<Volunteer> findAllByStatus(Status status);
    Page<Volunteer> findByStatus(Status status, Pageable pageable);

    Page<Volunteer> findByStatusAndNameContainingIgnoreCaseOrStatusAndMobileNumberContaining(
            Status status1, String name,
            Status status2, String mobile,
            Pageable pageable
    );
}
