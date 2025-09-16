package com.erfan.cch.Repo;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.Consumable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsumableRepository extends JpaRepository<Consumable, Long> {
    List<Consumable> findAllByStatus(Status status);
}
