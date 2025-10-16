package com.erfan.cch.Repo;


import com.erfan.cch.Models.EquipmentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentTypeRepository extends JpaRepository<EquipmentType, Long> {
    boolean existsByName(String name);
}
