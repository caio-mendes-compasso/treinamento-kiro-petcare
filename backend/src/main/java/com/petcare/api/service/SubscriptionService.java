package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.SubscriptionRequest;
import com.petcare.api.model.entity.Plan;
import com.petcare.api.model.entity.Subscription;
import com.petcare.api.model.entity.User;
import com.petcare.api.model.enums.SubscriptionStatus;
import com.petcare.api.repository.PlanRepository;
import com.petcare.api.repository.SubscriptionRepository;
import com.petcare.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final PlanRepository planRepository;
    private final UserRepository userRepository;

    @Transactional
    public Subscription create(UUID userId, SubscriptionRequest request) {
        // Verificar se já tem subscription ativa
        boolean hasActive = subscriptionRepository.existsByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE);
        if (hasActive) {
            throw new BusinessException("Usuário já possui uma assinatura ativa");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Plan plan = planRepository.findById(request.planId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan", request.planId()));

        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(plan)
                .status(SubscriptionStatus.ACTIVE)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusYears(1))
                .build();

        return subscriptionRepository.save(subscription);
    }
}
