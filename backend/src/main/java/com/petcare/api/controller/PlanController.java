package com.petcare.api.controller;

import com.petcare.api.model.dto.PlanResponse;
import com.petcare.api.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@Tag(name = "Plans", description = "Planos disponíveis")
public class PlanController {

    private final PlanService planService;

    @GetMapping
    @Operation(summary = "Listar planos ativos")
    @ApiResponse(responseCode = "200", description = "Lista de planos ativos")
    public ResponseEntity<List<PlanResponse>> list() {
        return ResponseEntity.ok(planService.findAllActive());
    }
}
