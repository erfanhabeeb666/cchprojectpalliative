package com.erfan.cch.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VolunteerDashboardStatsDto {
    private long todayVisits;
    private long completedVisits;
}
