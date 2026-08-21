package com.petcare.api.controller;

import com.petcare.api.model.dto.SubscriptionRequest;
import com.petcare.api.model.entity.Subscription;
import com.petcare.api.security.CurrentUser;
import com.petcare.api.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "Assinaturas de planos")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    @Operation(summary = "Criar nova assinatura")
    @ApiResponse(responseCode = "201", description = "Assinatura criada")
    @ApiResponse(responseCode = "422", description = "Usuário já possui assinatura ativa")
    public ResponseEntity<Void> create(@CurrentUser UUID userId, @Valid @RequestBody SubscriptionRequest request) {
        subscriptionService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
