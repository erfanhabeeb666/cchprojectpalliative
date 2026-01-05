package com.erfan.cch.Models;

import com.erfan.cch.Enums.Status;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class PatientVisitReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, updatable = false)
    private String visitCode;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private LocalDate visitDate;
    private LocalDate completedDate;

    @ManyToMany
    @JoinTable(name = "visit_procedure", joinColumns = @JoinColumn(name = "visit_id"), inverseJoinColumns = @JoinColumn(name = "procedure_id"))
    private List<ProcedureDone> proceduresDone;

    @OneToMany(mappedBy = "visitReport", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VisitConsumableUsage> consumablesUsed;

    private Status status;
    private String notes;
    private String submittedBy;

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public PatientVisitReport() {
    }

    @PrePersist
    public void generateVisitCode() {
        if (this.visitCode == null) {
            String prefix = "VIS";
            String datePart = LocalDate.now().toString().replace("-", ""); // YYYYMMDD
            String randomPart = String.format("%05d", (int) (Math.random() * 100000));
            this.visitCode = prefix + "-" + datePart + "-" + randomPart;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getVisitCode() {
        return visitCode;
    }

    public void setVisitCode(String visitCode) {
        this.visitCode = visitCode;
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

    public List<VisitConsumableUsage> getConsumablesUsed() {
        return consumablesUsed;
    }

    public void setConsumablesUsed(List<VisitConsumableUsage> consumablesUsed) {
        this.consumablesUsed = consumablesUsed;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

}
