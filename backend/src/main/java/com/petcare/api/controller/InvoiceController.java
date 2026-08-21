package com.petcare.api.controller;

import com.petcare.api.model.dto.InvoiceResponse;
import com.petcare.api.model.dto.PageResponse;
import com.petcare.api.model.enums.InvoiceStatus;
import com.petcare.api.security.CurrentUser;
import com.petcare.api.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices", description = "Gerenciamento de faturas")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    @Operation(summary = "Listar faturas do usuário")
    @ApiResponse(responseCode = "200", description = "Lista paginada de faturas")
    public ResponseEntity<PageResponse<InvoiceResponse>> list(
            @CurrentUser UUID userId,
            @RequestParam(required = false) InvoiceStatus status,
            Pageable pageable) {
        return ResponseEntity.ok(invoiceService.findByUser(userId, status, pageable));
    }

    @PostMapping("/{id}/pay")
    @Operation(summary = "Pagar fatura")
    @ApiResponse(responseCode = "200", description = "Fatura paga com sucesso")
    @ApiResponse(responseCode = "422", description = "Fatura já está paga")
    public ResponseEntity<InvoiceResponse> pay(@CurrentUser UUID userId, @PathVariable UUID id) {
        return ResponseEntity.ok(invoiceService.pay(userId, id));
    }
}
