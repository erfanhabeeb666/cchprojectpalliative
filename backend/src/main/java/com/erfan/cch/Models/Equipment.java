package com.erfan.cch.Models;


import jakarta.persistence.*;


@Entity
public class Equipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private boolean allocated;
    

    @ManyToOne
    private Patient allocatedTo;

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

    public Patient getAllocatedTo() {
        return allocatedTo;
    }

    public void setAllocatedTo(Patient allocatedTo) {
        this.allocatedTo = allocatedTo;
    }

    public boolean isAllocated() {
        return allocated;
    }

    public void setAllocated(boolean allocated) {
        this.allocated = allocated;
    }
}



