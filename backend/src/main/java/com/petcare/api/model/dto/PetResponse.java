package com.petcare.api.model.dto;

import com.petcare.api.model.entity.Pet;
import com.petcare.api.model.enums.Species;

import java.time.LocalDate;
import java.util.UUID;

public record PetResponse(
        UUID id,
        String name,
        Species species,
        String breed,
        LocalDate birthDate,
        Double weight,
        String color,
        String photoUrl
) {
    public static PetResponse from(Pet pet) {
        return new PetResponse(
                pet.getId(),
                pet.getName(),
                pet.getSpecies(),
                pet.getBreed(),
                pet.getBirthDate(),
                pet.getWeight(),
                pet.getColor(),
                pet.getPhotoUrl()
        );
    }
}
