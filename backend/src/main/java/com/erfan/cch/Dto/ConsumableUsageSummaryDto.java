package com.erfan.cch.Dto;

public class ConsumableUsageSummaryDto {
    private Long consumableId;
    private String name;
    private Long totalQuantityUsed;

    public ConsumableUsageSummaryDto() {}

    public ConsumableUsageSummaryDto(Long consumableId, String name, Long totalQuantityUsed) {
        this.consumableId = consumableId;
        this.name = name;
        this.totalQuantityUsed = totalQuantityUsed;
    }

    public Long getConsumableId() { return consumableId; }
    public void setConsumableId(Long consumableId) { this.consumableId = consumableId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getTotalQuantityUsed() { return totalQuantityUsed; }
    public void setTotalQuantityUsed(Long totalQuantityUsed) { this.totalQuantityUsed = totalQuantityUsed; }
}
