package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import com.petcare.api.exception.ForbiddenException;
import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.InvoiceResponse;
import com.petcare.api.model.entity.Invoice;
import com.petcare.api.model.entity.User;
import com.petcare.api.model.enums.InvoiceStatus;
import com.petcare.api.repository.InvoiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private InvoiceService invoiceService;

    private UUID userId;
    private User user;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = User.builder().id(userId).name("Maria").email("maria@email.com").build();
    }

    @Test
    @DisplayName("Deve pagar fatura pendente com sucesso")
    void should_pay_pending_invoice() {
        UUID invoiceId = UUID.randomUUID();
        Invoice invoice = Invoice.builder()
                .id(invoiceId)
                .user(user)
                .status(InvoiceStatus.PENDING)
                .amount(BigDecimal.valueOf(89.90))
                .referenceMonth("2025-03")
                .dueDate(LocalDate.of(2025, 3, 15))
                .build();

        when(invoiceRepository.findById(invoiceId)).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);

        InvoiceResponse response = invoiceService.pay(userId, invoiceId);

        assertThat(response.status()).isEqualTo(InvoiceStatus.PAID);
        assertThat(invoice.getPaidAt()).isNotNull();
        verify(invoiceRepository).save(invoice);
    }

    @Test
    @DisplayName("Deve pagar fatura vencida com sucesso")
    void should_pay_overdue_invoice() {
        UUID invoiceId = UUID.randomUUID();
        Invoice invoice = Invoice.builder()
                .id(invoiceId)
                .user(user)
                .status(InvoiceStatus.OVERDUE)
                .amount(BigDecimal.valueOf(89.90))
                .referenceMonth("2025-01")
                .dueDate(LocalDate.of(2025, 1, 15))
                .build();

        when(invoiceRepository.findById(invoiceId)).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(Invoice.class))).thenReturn(invoice);

        InvoiceResponse response = invoiceService.pay(userId, invoiceId);

        assertThat(response.status()).isEqualTo(InvoiceStatus.PAID);
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando fatura ja esta paga")
    void should_throw_when_invoice_already_paid() {
        UUID invoiceId = UUID.randomUUID();
        Invoice invoice = Invoice.builder()
                .id(invoiceId)
                .user(user)
                .status(InvoiceStatus.PAID)
                .amount(BigDecimal.valueOf(89.90))
                .referenceMonth("2025-02")
                .dueDate(LocalDate.of(2025, 2, 15))
                .build();

        when(invoiceRepository.findById(invoiceId)).thenReturn(Optional.of(invoice));

        assertThatThrownBy(() -> invoiceService.pay(userId, invoiceId))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("já está paga");
    }

    @Test
    @DisplayName("Deve lançar ForbiddenException quando fatura pertence a outro usuario")
    void should_throw_forbidden_when_invoice_belongs_to_other_user() {
        UUID otherUserId = UUID.randomUUID();
        User otherUser = User.builder().id(otherUserId).build();
        UUID invoiceId = UUID.randomUUID();
        Invoice invoice = Invoice.builder()
                .id(invoiceId)
                .user(otherUser)
                .status(InvoiceStatus.PENDING)
                .build();

        when(invoiceRepository.findById(invoiceId)).thenReturn(Optional.of(invoice));

        assertThatThrownBy(() -> invoiceService.pay(userId, invoiceId))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando fatura não existe")
    void should_throw_not_found_when_invoice_missing() {
        UUID invoiceId = UUID.randomUUID();
        when(invoiceRepository.findById(invoiceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> invoiceService.pay(userId, invoiceId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
