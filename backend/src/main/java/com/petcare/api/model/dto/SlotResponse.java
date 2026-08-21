package com.petcare.api.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalTime;

public record SlotResponse(
        @JsonFormat(pattern = "HH:mm")
        LocalTime time,
        boolean available
) {}
