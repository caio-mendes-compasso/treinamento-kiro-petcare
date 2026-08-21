package com.petcare.api.repository;

import com.petcare.api.model.entity.Subscription;
import com.petcare.api.model.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    Optional<Subscription> findByUserIdAndStatus(UUID userId, SubscriptionStatus status);

    boolean existsByUserIdAndStatus(UUID userId, SubscriptionStatus status);
}
