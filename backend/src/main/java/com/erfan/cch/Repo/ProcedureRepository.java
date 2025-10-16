package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.ProcedureDone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface ProcedureRepository extends JpaRepository<ProcedureDone, Long> {
    List<ProcedureDone> findAllByStatus(Status status);
}
