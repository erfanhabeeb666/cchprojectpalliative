package com.erfan.cch.Models;

import com.erfan.cch.Enums.Status;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Entity
public class PatientVisitReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private LocalDate visitDate;

    private LocalDate completedDate;

    @ManyToMany
    @JoinTable(
            name = "visit_procedure",
            joinColumns = @JoinColumn(name = "visit_id"),
            inverseJoinColumns = @JoinColumn(name = "procedure_id")
    )
    private List<ProcedureDone> proceduresDone;


    @ElementCollection
    private Map<String, Integer> consumablesUsed; /// Example: {"Painkillers": 2, "Diapers": 1}

    private Status status;

    public PatientVisitReport() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public LocalDate getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDate completedDate) {
        this.completedDate = completedDate;
    }

    public List<ProcedureDone> getProceduresDone() {
        return proceduresDone;
    }

    public void setProceduresDone(List<ProcedureDone> proceduresDone) {
        this.proceduresDone = proceduresDone;
    }

    public Map<String, Integer> getConsumablesUsed() {
        return consumablesUsed;
    }

    public void setConsumablesUsed(Map<String, Integer> consumablesUsed) {
        this.consumablesUsed = consumablesUsed;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public PatientVisitReport(Long id, Volunteer volunteer, Patient patient, LocalDate visitDate, LocalDate completedDate, List<ProcedureDone> proceduresDone, Map<String, Integer> consumablesUsed, Status status) {
        this.id = id;
        this.volunteer = volunteer;
        this.patient = patient;
        this.visitDate = visitDate;
        this.completedDate = completedDate;
        this.proceduresDone = proceduresDone;
        this.consumablesUsed = consumablesUsed;
        this.status = status;
    }

}

