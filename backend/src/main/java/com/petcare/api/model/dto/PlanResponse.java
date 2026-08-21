package com.petcare.api.model.dto;

import com.petcare.api.model.entity.Plan;

import java.math.BigDecimal;
import java.util.List;

public record PlanResponse(
        Long id,
        String name,
        BigDecimal price,
        List<String> features
) {
    public static PlanResponse from(Plan plan) {
        return new PlanResponse(
                plan.getId(),
                plan.getName(),
                plan.getPrice(),
                plan.getFeatures()
        );
    }
}
