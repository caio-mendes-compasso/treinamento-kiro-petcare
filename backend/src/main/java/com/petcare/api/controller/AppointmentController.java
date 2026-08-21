package com.petcare.api.controller;

import com.petcare.api.model.dto.AppointmentRequest;
import com.petcare.api.model.dto.AppointmentResponse;
import com.petcare.api.model.dto.PageResponse;
import com.petcare.api.model.dto.SlotResponse;
import com.petcare.api.security.CurrentUser;
import com.petcare.api.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointments", description = "Agendamento de consultas e exames")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    @Operation(summary = "Listar agendamentos do usuário")
    @ApiResponse(responseCode = "200", description = "Lista paginada de agendamentos")
    public ResponseEntity<PageResponse<AppointmentResponse>> list(@CurrentUser UUID userId, Pageable pageable) {
        return ResponseEntity.ok(appointmentService.findByUser(userId, pageable));
    }

    @PostMapping
    @Operation(summary = "Criar novo agendamento")
    @ApiResponse(responseCode = "201", description = "Agendamento criado")
    @ApiResponse(responseCode = "422", description = "Slot ocupado ou data inválida")
    public ResponseEntity<AppointmentResponse> create(@CurrentUser UUID userId, @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.create(userId, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancelar agendamento")
    @ApiResponse(responseCode = "204", description = "Agendamento cancelado")
    @ApiResponse(responseCode = "403", description = "Agendamento não pertence ao usuário")
    public ResponseEntity<Void> cancel(@CurrentUser UUID userId, @PathVariable UUID id) {
        appointmentService.cancel(userId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/slots")
    @Operation(summary = "Consultar slots disponíveis para uma data")
    @ApiResponse(responseCode = "200", description = "Lista de slots com disponibilidade")
    public ResponseEntity<List<SlotResponse>> getSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(date));
    }
}
