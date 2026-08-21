package com.petcare.api.repository;

import com.petcare.api.model.entity.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PetRepository extends JpaRepository<Pet, UUID> {

    List<Pet> findByUserId(UUID userId);

    Page<Pet> findByUserId(UUID userId, Pageable pageable);

    long countByUserId(UUID userId);
}
