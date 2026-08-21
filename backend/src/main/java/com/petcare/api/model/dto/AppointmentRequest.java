package com.petcare.api.model.dto;

import com.petcare.api.model.enums.AppointmentType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentRequest(
        @NotNull(message = "Pet é obrigatório")
        UUID petId,

        @NotNull(message = "Tipo é obrigatório")
        AppointmentType type,

        @NotNull(message = "Data é obrigatória")
        @Future(message = "Data deve ser futura")
        LocalDate date,

        @NotNull(message = "Horário é obrigatório")
        LocalTime time
) {}
