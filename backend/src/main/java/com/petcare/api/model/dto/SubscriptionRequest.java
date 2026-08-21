package com.petcare.api.model.dto;

import jakarta.validation.constraints.NotNull;

public record SubscriptionRequest(
        @NotNull(message = "Plano é obrigatório")
        Long planId
) {}
