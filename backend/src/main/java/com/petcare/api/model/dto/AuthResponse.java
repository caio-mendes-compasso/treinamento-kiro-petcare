package com.petcare.api.model.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {}
