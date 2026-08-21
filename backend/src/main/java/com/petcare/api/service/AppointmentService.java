package com.petcare.api.service;

import com.petcare.api.exception.BusinessException;
import com.petcare.api.exception.ForbiddenException;
import com.petcare.api.exception.ResourceNotFoundException;
import com.petcare.api.model.dto.AppointmentRequest;
import com.petcare.api.model.dto.AppointmentResponse;
import com.petcare.api.model.dto.PageResponse;
import com.petcare.api.model.dto.SlotResponse;
import com.petcare.api.model.entity.Appointment;
import com.petcare.api.model.entity.Pet;
import com.petcare.api.model.enums.AppointmentStatus;
import com.petcare.api.repository.AppointmentRepository;
import com.petcare.api.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private static final List<LocalTime> VALID_SLOTS = List.of(
            LocalTime.of(9, 0),
            LocalTime.of(10, 0),
            LocalTime.of(11, 0),
            LocalTime.of(14, 0),
            LocalTime.of(15, 0),
            LocalTime.of(16, 0)
    );

    private final AppointmentRepository appointmentRepository;
    private final PetRepository petRepository;

    public PageResponse<AppointmentResponse> findByUser(UUID userId, Pageable pageable) {
        List<UUID> petIds = petRepository.findByUserId(userId).stream()
                .map(Pet::getId)
                .toList();

        if (petIds.isEmpty()) {
            return new PageResponse<>(List.of(), 0, pageable.getPageSize(), 0, 0, true);
        }

        var page = appointmentRepository.findByPetIdIn(petIds, pageable);
        return PageResponse.from(page, AppointmentResponse::from);
    }

    @Transactional
    public AppointmentResponse create(UUID userId, AppointmentRequest request) {
        // Validar que a data é futura
        if (!request.date().isAfter(LocalDate.now())) {
            throw new BusinessException("Data do agendamento deve ser futura");
        }

        // Validar horário válido
        if (!VALID_SLOTS.contains(request.time())) {
            throw new BusinessException("Horário inválido. Horários disponíveis: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00");
        }

        // Validar slot não ocupado
        boolean slotOccupied = appointmentRepository.existsByDateAndTimeAndStatus(
                request.date(), request.time(), AppointmentStatus.CONFIRMED);
        if (slotOccupied) {
            throw new BusinessException("Horário já está ocupado para esta data");
        }

        // Validar que o pet pertence ao usuário
        Pet pet = petRepository.findById(request.petId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet", request.petId()));

        if (!pet.getUser().getId().equals(userId)) {
            throw new ForbiddenException();
        }

        Appointment appointment = Appointment.builder()
                .pet(pet)
                .type(request.type())
                .date(request.date())
                .time(request.time())
                .status(AppointmentStatus.CONFIRMED)
                .build();

        appointment = appointmentRepository.save(appointment);
        return AppointmentResponse.from(appointment);
    }

    @Transactional
    public void cancel(UUID userId, UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));

        if (!appointment.getPet().getUser().getId().equals(userId)) {
            throw new ForbiddenException();
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    public List<SlotResponse> getAvailableSlots(LocalDate date) {
        List<Appointment> confirmedAppointments = appointmentRepository
                .findByDateAndStatus(date, AppointmentStatus.CONFIRMED);

        Set<LocalTime> occupiedTimes = confirmedAppointments.stream()
                .map(Appointment::getTime)
                .collect(Collectors.toSet());

        return VALID_SLOTS.stream()
                .map(time -> new SlotResponse(time, !occupiedTimes.contains(time)))
                .toList();
    }
}
