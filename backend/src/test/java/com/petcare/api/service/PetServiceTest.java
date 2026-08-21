package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import com.petcare.api.exception.ForbiddenException;
import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.PetRequest;
import com.petcare.api.model.dto.PetResponse;
import com.petcare.api.model.entity.Pet;
import com.petcare.api.model.entity.User;
import com.petcare.api.model.enums.Species;
import com.petcare.api.repository.PetRepository;
import com.petcare.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetRepository petRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PetService petService;

    private UUID userId;
    private User user;
    private PetRequest petRequest;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        user = User.builder().id(userId).name("Maria").email("maria@email.com").build();
        petRequest = new PetRequest("Thor", Species.DOG, "Golden Retriever", LocalDate.of(2020, 3, 15), 32.0, "Dourado");
    }

    @Test
    @DisplayName("Deve criar pet quando usuario tem menos de 3 pets")
    void should_create_pet_when_under_limit() {
        when(petRepository.countByUserId(userId)).thenReturn(2L);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(petRepository.save(any(Pet.class))).thenAnswer(invocation -> {
            Pet pet = invocation.getArgument(0);
            pet.setId(UUID.randomUUID());
            return pet;
        });

        PetResponse response = petService.create(userId, petRequest);

        assertThat(response.name()).isEqualTo("Thor");
        assertThat(response.species()).isEqualTo(Species.DOG);
        verify(petRepository).save(any(Pet.class));
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando usuario ja tem 3 pets")
    void should_throw_when_pet_limit_reached() {
        when(petRepository.countByUserId(userId)).thenReturn(3L);

        assertThatThrownBy(() -> petService.create(userId, petRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Limite de 3 pets");
    }

    @Test
    @DisplayName("Deve lançar ForbiddenException quando pet pertence a outro usuario")
    void should_throw_forbidden_when_pet_belongs_to_other_user() {
        UUID otherUserId = UUID.randomUUID();
        User otherUser = User.builder().id(otherUserId).build();
        Pet pet = Pet.builder().id(UUID.randomUUID()).user(otherUser).name("Thor").build();

        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        assertThatThrownBy(() -> petService.delete(userId, pet.getId()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    @DisplayName("Deve deletar pet quando pertence ao usuario")
    void should_delete_pet_when_owner() {
        Pet pet = Pet.builder().id(UUID.randomUUID()).user(user).name("Thor").build();
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        petService.delete(userId, pet.getId());

        verify(petRepository).delete(pet);
    }

    @Test
    @DisplayName("Deve lançar ResourceNotFoundException quando pet não existe")
    void should_throw_not_found_when_pet_missing() {
        UUID petId = UUID.randomUUID();
        when(petRepository.findById(petId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> petService.delete(userId, petId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
