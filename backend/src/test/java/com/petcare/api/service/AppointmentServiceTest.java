package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import com.petcare.api.exception.ForbiddenException;
import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.AppointmentRequest;
import com.petcare.api.model.dto.AppointmentResponse;
import com.petcare.api.model.dto.SlotResponse;
import com.petcare.api.model.entity.Appointment;
import com.petcare.api.model.entity.Pet;
import com.petcare.api.model.entity.User;
import com.petcare.api.model.enums.AppointmentStatus;
import com.petcare.api.model.enums.AppointmentType;
import com.petcare.api.model.enums.Species;
import com.petcare.api.repository.AppointmentRepository;
import com.petcare.api.repository.PetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private PetRepository petRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private UUID userId;
    private UUID petId;
    private User user;
    private Pet pet;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        petId = UUID.randomUUID();
        user = User.builder().id(userId).name("Maria").email("maria@email.com").build();
        pet = Pet.builder().id(petId).user(user).name("Thor").species(Species.DOG).build();
    }

    @Test
    @DisplayName("Deve criar agendamento em slot disponivel")
    void should_create_appointment_when_slot_available() {
        LocalDate futureDate = LocalDate.now().plusDays(5);
        AppointmentRequest request = new AppointmentRequest(petId, AppointmentType.CONSULTATION, futureDate, LocalTime.of(9, 0));

        when(appointmentRepository.existsByDateAndTimeAndStatus(futureDate, LocalTime.of(9, 0), AppointmentStatus.CONFIRMED)).thenReturn(false);
        when(petRepository.findById(petId)).thenReturn(Optional.of(pet));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment a = invocation.getArgument(0);
            a.setId(UUID.randomUUID());
            return a;
        });

        AppointmentResponse response = appointmentService.create(userId, request);

        assertThat(response.petName()).isEqualTo("Thor");
        assertThat(response.type()).isEqualTo(AppointmentType.CONSULTATION);
        verify(appointmentRepository).save(any(Appointment.class));
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando slot esta ocupado")
    void should_throw_when_slot_occupied() {
        LocalDate futureDate = LocalDate.now().plusDays(5);
        AppointmentRequest request = new AppointmentRequest(petId, AppointmentType.CONSULTATION, futureDate, LocalTime.of(9, 0));

        when(appointmentRepository.existsByDateAndTimeAndStatus(futureDate, LocalTime.of(9, 0), AppointmentStatus.CONFIRMED)).thenReturn(true);

        assertThatThrownBy(() -> appointmentService.create(userId, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("ocupado");
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando data é passada")
    void should_throw_when_date_in_past() {
        LocalDate pastDate = LocalDate.now().minusDays(1);
        AppointmentRequest request = new AppointmentRequest(petId, AppointmentType.EXAM, pastDate, LocalTime.of(10, 0));

        assertThatThrownBy(() -> appointmentService.create(userId, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("futura");
    }

    @Test
    @DisplayName("Deve lançar BusinessException quando horário é inválido")
    void should_throw_when_time_invalid() {
        LocalDate futureDate = LocalDate.now().plusDays(5);
        AppointmentRequest request = new AppointmentRequest(petId, AppointmentType.CONSULTATION, futureDate, LocalTime.of(12, 0));

        assertThatThrownBy(() -> appointmentService.create(userId, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Horário inválido");
    }

    @Test
    @DisplayName("Deve cancelar agendamento com sucesso")
    void should_cancel_appointment() {
        UUID appointmentId = UUID.randomUUID();
        Appointment appointment = Appointment.builder()
                .id(appointmentId)
                .pet(pet)
                .status(AppointmentStatus.CONFIRMED)
                .build();

        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        appointmentService.cancel(userId, appointmentId);

        assertThat(appointment.getStatus()).isEqualTo(AppointmentStatus.CANCELLED);
        verify(appointmentRepository).save(appointment);
    }

    @Test
    @DisplayName("Deve lançar ForbiddenException ao cancelar agendamento de outro usuario")
    void should_throw_forbidden_when_cancelling_other_user_appointment() {
        UUID otherUserId = UUID.randomUUID();
        User otherUser = User.builder().id(otherUserId).build();
        Pet otherPet = Pet.builder().id(UUID.randomUUID()).user(otherUser).build();
        UUID appointmentId = UUID.randomUUID();
        Appointment appointment = Appointment.builder().id(appointmentId).pet(otherPet).build();

        when(appointmentRepository.findById(appointmentId)).thenReturn(Optional.of(appointment));

        assertThatThrownBy(() -> appointmentService.cancel(userId, appointmentId))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    @DisplayName("Deve retornar slots com disponibilidade correta")
    void should_return_slots_with_availability() {
        LocalDate date = LocalDate.now().plusDays(3);
        Appointment existing = Appointment.builder()
                .time(LocalTime.of(9, 0))
                .build();

        when(appointmentRepository.findByDateAndStatus(date, AppointmentStatus.CONFIRMED))
                .thenReturn(List.of(existing));

        List<SlotResponse> slots = appointmentService.getAvailableSlots(date);

        assertThat(slots).hasSize(6);
        assertThat(slots.stream().filter(s -> !s.available()).count()).isEqualTo(1);
        assertThat(slots.get(0).time()).isEqualTo(LocalTime.of(9, 0));
        assertThat(slots.get(0).available()).isFalse();
        assertThat(slots.get(1).available()).isTrue();
    }
}
