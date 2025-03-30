package com.erfan.cch.Repo;

import com.erfan.cch.Models.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    List<Equipment> findByAllocated(boolean b);
}
