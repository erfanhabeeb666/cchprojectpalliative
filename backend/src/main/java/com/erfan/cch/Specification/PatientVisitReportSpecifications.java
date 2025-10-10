package com.erfan.cch.Specification;

import com.erfan.cch.Enums.Status;
import com.erfan.cch.Models.PatientVisitReport;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;

public class PatientVisitReportSpecifications {

    public static Specification<PatientVisitReport> hasStatus(Status status) {
        return (root, query, builder) ->
                status == null ? null : builder.equal(root.get("status"), status);
    }

    public static Specification<PatientVisitReport> visitDateBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, builder) -> {
            if (startDate != null && endDate != null) {
                return builder.between(root.get("visitDate"), startDate, endDate);
            } else if (startDate != null) {
                return builder.greaterThanOrEqualTo(root.get("visitDate"), startDate);
            } else if (endDate != null) {
                return builder.lessThanOrEqualTo(root.get("visitDate"), endDate);
            }
            return null;
        };
    }

    public static Specification<PatientVisitReport> visitDateAfter(LocalDate startDate) {
        return (root, query, cb) -> startDate == null ? null :
                cb.greaterThanOrEqualTo(root.get("visitDate"), startDate);
    }

    public static Specification<PatientVisitReport> visitDateBefore(LocalDate endDate) {
        return (root, query, cb) -> endDate == null ? null :
                cb.lessThanOrEqualTo(root.get("visitDate"), endDate);
    }
}
