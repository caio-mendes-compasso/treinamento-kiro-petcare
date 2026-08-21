package com.petcare.api.model.dto;

import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @Size(min = 3, message = "Nome deve ter no mínimo 3 caracteres")
        String name,

        String cpf,

        String phone
) {}
