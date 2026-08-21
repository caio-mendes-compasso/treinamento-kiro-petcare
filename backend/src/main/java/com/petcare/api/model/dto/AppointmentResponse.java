package com.petcare.api.model.dto;

import com.petcare.api.model.entity.Appointment;
import com.petcare.api.model.enums.AppointmentStatus;
import com.petcare.api.model.enums.AppointmentType;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record AppointmentResponse(
        UUID id,
        UUID petId,
        String petName,
        AppointmentType type,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate date,
        @JsonFormat(pattern = "HH:mm")
        LocalTime time,
        AppointmentStatus status
) {
    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPet().getId(),
                appointment.getPet().getName(),
                appointment.getType(),
                appointment.getDate(),
                appointment.getTime(),
                appointment.getStatus()
        );
    }
}
