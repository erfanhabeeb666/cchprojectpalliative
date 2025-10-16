package com.erfan.cch.Models;

import com.erfan.cch.Enums.Status;
import jakarta.persistence.*;

@Entity
public class Consumable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;          // e.g. Syringe, Band Aid, Diaper
    private String category;      // e.g. Injection, First Aid, Hygiene
    private Integer stockQuantity; // Available stock
    private String unit;          // e.g. pieces, box, packets

    @Enumerated(EnumType.STRING)
    private Status status;        // ACTIVE, INACTIVE

    public Consumable() {}

    public Consumable(String name, String category, Integer stockQuantity, String unit, Status status) {
        this.name = name;
        this.category = category;
        this.stockQuantity = stockQuantity;
        this.unit = unit;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}
