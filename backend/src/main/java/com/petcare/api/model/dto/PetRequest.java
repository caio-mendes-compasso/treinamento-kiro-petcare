package com.petcare.api.model.dto;

import com.petcare.api.model.enums.Species;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record PetRequest(
        @NotBlank(message = "Nome é obrigatório")
        String name,

        @NotNull(message = "Espécie é obrigatória")
        Species species,

        String breed,

        @Past(message = "Data de nascimento deve ser no passado")
        LocalDate birthDate,

        @Positive(message = "Peso deve ser positivo")
        Double weight,

        String color
) {}
