package com.petcare.api.repository;

import com.petcare.api.model.entity.Appointment;
import com.petcare.api.model.enums.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("SELECT a FROM Appointment a WHERE a.pet.id IN :petIds")
    Page<Appointment> findByPetIdIn(@Param("petIds") List<UUID> petIds, Pageable pageable);

    List<Appointment> findByDateAndStatus(LocalDate date, AppointmentStatus status);

    boolean existsByDateAndTimeAndStatus(LocalDate date, LocalTime time, AppointmentStatus status);
}
