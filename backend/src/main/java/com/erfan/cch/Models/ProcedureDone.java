package com.erfan.cch.Models;


import com.erfan.cch.Enums.Status;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class ProcedureDone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name; // Example: "Dressing Change", "Pain Management"

    @ManyToMany(mappedBy = "proceduresDone")
    private List<PatientVisitReport> visits;

    private Status status;

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public List<PatientVisitReport> getVisits() {
        return visits;
    }
    public void setVisits(List<PatientVisitReport> visits) {
        this.visits = visits;
    }

}

