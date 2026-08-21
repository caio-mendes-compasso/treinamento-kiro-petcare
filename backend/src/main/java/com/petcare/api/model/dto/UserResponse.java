package com.petcare.api.model.dto;

import com.petcare.api.model.entity.User;
import com.petcare.api.model.enums.PlanType;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String email,
        String cpf,
        PlanType planType
) {
    public static UserResponse from(User user) {
        String maskedCpf = null;
        if (user.getCpf() != null && user.getCpf().length() >= 11) {
            maskedCpf = "***." + user.getCpf().substring(3, 6) + "." + user.getCpf().substring(6, 9) + "-**";
        }
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                maskedCpf,
                user.getPlanType()
        );
    }
}
