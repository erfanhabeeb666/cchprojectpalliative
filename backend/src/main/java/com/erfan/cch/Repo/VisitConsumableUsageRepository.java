package com.erfan.cch.Repo;

import com.erfan.cch.Models.VisitConsumableUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VisitConsumableUsageRepository extends JpaRepository<VisitConsumableUsage, Long> {
    @Query("""
            SELECT u.consumable.id, u.consumable.name, SUM(u.quantityUsed)
            FROM VisitConsumableUsage u
            JOIN u.visitReport v
            WHERE v.status = com.erfan.cch.Enums.Status.COMPLETED
              AND (:startDate IS NULL OR v.completedDate >= :startDate)
              AND (:endDate IS NULL OR v.completedDate <= :endDate)
            GROUP BY u.consumable.id, u.consumable.name
            ORDER BY u.consumable.name
            """)
    List<Object[]> findUsageSummary(@Param("startDate") LocalDate startDate,
                                    @Param("endDate") LocalDate endDate);
}
