package com.erfan.cch.Models;

import jakarta.persistence.*;

@Entity
public class VisitConsumableUsage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private PatientVisitReport visitReport;

    @ManyToOne
    private Consumable consumable;

    private Integer quantityUsed; // e.g. 2 syringes used

    public VisitConsumableUsage() {}

    public VisitConsumableUsage(PatientVisitReport visitReport, Consumable consumable, Integer quantityUsed) {
        this.visitReport = visitReport;
        this.consumable = consumable;
        this.quantityUsed = quantityUsed;
    }

    public Long getId() { return id; }

    public PatientVisitReport getVisitReport() { return visitReport; }
    public void setVisitReport(PatientVisitReport visitReport) { this.visitReport = visitReport; }

    public Consumable getConsumable() { return consumable; }
    public void setConsumable(Consumable consumable) { this.consumable = consumable; }

    public Integer getQuantityUsed() { return quantityUsed; }
    public void setQuantityUsed(Integer quantityUsed) { this.quantityUsed = quantityUsed; }
}
