package com.petcare.api.model.dto;

import com.petcare.api.model.entity.Invoice;
import com.petcare.api.model.enums.InvoiceStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record InvoiceResponse(
        UUID id,
        String referenceMonth,
        BigDecimal amount,
        InvoiceStatus status,
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate dueDate,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime paidAt
) {
    public static InvoiceResponse from(Invoice invoice) {
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getReferenceMonth(),
                invoice.getAmount(),
                invoice.getStatus(),
                invoice.getDueDate(),
                invoice.getPaidAt()
        );
    }
}
