// src/main/java/com/erfan/cch/dto/ConsumableDto.java
package com.erfan.cch.Dto;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class ConsumableDto {
    private Long id;
    private String name;
    private int quantity;
}

