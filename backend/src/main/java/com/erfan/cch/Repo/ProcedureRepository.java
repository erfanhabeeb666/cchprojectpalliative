package com.erfan.cch.Repo;

import com.erfan.cch.Models.ProcedureDone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcedureRepository extends JpaRepository<ProcedureDone, Long> {}
