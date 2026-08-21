package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import com.petcare.api.exception.ForbiddenException;
import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.InvoiceResponse;
import com.petcare.api.model.dto.PageResponse;
import com.petcare.api.model.entity.Invoice;
import com.petcare.api.model.enums.InvoiceStatus;
import com.petcare.api.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public PageResponse<InvoiceResponse> findByUser(UUID userId, InvoiceStatus status, Pageable pageable) {
        if (status != null) {
            var page = invoiceRepository.findByUserIdAndStatus(userId, status, pageable);
            return PageResponse.from(page, InvoiceResponse::from);
        }
        var page = invoiceRepository.findByUserId(userId, pageable);
        return PageResponse.from(page, InvoiceResponse::from);
    }

    @Transactional
    public InvoiceResponse pay(UUID userId, UUID invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", invoiceId));

        if (!invoice.getUser().getId().equals(userId)) {
            throw new ForbiddenException();
        }

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new BusinessException("Fatura já está paga");
        }

        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        invoice = invoiceRepository.save(invoice);

        return InvoiceResponse.from(invoice);
    }
}
