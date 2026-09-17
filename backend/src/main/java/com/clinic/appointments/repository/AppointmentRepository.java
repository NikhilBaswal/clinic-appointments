package com.clinic.appointments.repository;

import com.clinic.appointments.entity.Appointment;
import com.clinic.appointments.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("""
        SELECT a
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
        AND a.status = :status
        AND a.startTime < :endTime
        AND a.endTime > :startTime
    """)
    List<Appointment> findOverlappingAppointments(
            @Param("doctorId") Long doctorId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("status") AppointmentStatus status
    );

    List<Appointment> findByDoctorIdAndStartTimeBetween(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Appointment> findByPatientNameIgnoreCase(String patientName);
}
