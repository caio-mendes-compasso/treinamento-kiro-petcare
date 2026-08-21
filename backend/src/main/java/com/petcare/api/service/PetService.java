package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import com.petcare.api.exception.ForbiddenException;
import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.PetRequest;
import com.petcare.api.model.dto.PetResponse;
import com.petcare.api.model.dto.PageResponse;
import com.petcare.api.model.entity.Pet;
import com.petcare.api.model.entity.User;
import com.petcare.api.repository.PetRepository;
import com.petcare.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PetService {

    private static final int MAX_PETS_PER_USER = 3;

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public PageResponse<PetResponse> findByUser(UUID userId, Pageable pageable) {
        var page = petRepository.findByUserId(userId, pageable);
        return PageResponse.from(page, PetResponse::from);
    }

    @Transactional
    public PetResponse create(UUID userId, PetRequest request) {
        long count = petRepository.countByUserId(userId);
        if (count >= MAX_PETS_PER_USER) {
            throw new BusinessException("Limite de " + MAX_PETS_PER_USER + " pets por usuário atingido");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Pet pet = Pet.builder()
                .user(user)
                .name(request.name())
                .species(request.species())
                .breed(request.breed())
                .birthDate(request.birthDate())
                .weight(request.weight())
                .color(request.color())
                .build();

        pet = petRepository.save(pet);
        return PetResponse.from(pet);
    }

    @Transactional
    public PetResponse update(UUID userId, UUID petId, PetRequest request) {
        Pet pet = getPetWithOwnershipCheck(userId, petId);

        pet.setName(request.name());
        pet.setSpecies(request.species());
        pet.setBreed(request.breed());
        pet.setBirthDate(request.birthDate());
        pet.setWeight(request.weight());
        pet.setColor(request.color());

        pet = petRepository.save(pet);
        return PetResponse.from(pet);
    }

    @Transactional
    public void delete(UUID userId, UUID petId) {
        Pet pet = getPetWithOwnershipCheck(userId, petId);
        petRepository.delete(pet);
    }

    @Transactional
    public void updatePhotoUrl(UUID userId, UUID petId, String photoUrl) {
        Pet pet = getPetWithOwnershipCheck(userId, petId);
        pet.setPhotoUrl(photoUrl);
        petRepository.save(pet);
    }

    public Pet getPetWithOwnershipCheck(UUID userId, UUID petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet", petId));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ForbiddenException();
        }
        return pet;
    }
}
