package com.erfan.cch.Dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class ConsumableAdjustment {
    private Long consumableId;   // which item
    private int delta;           // +N when returned, -N when given
}


