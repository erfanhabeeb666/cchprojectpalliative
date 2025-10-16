package com.erfan.cch.Dto;

public class ConsumableUsageDto {
    private Long consumableId;
    private Integer quantity;

    // Getters and Setters
    public Long  getConsumableId() {
        return consumableId;
    }

    public void setConsumableId(Long consumableId) {
        this.consumableId = consumableId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
