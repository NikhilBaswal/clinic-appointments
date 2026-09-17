package com.clinic.appointments.service;

import com.clinic.appointments.exception.AppointmentConflictException;
import com.clinic.appointments.entity.Appointment;
import com.clinic.appointments.entity.AppointmentStatus;
import com.clinic.appointments.entity.Doctor;
import com.clinic.appointments.entity.Patient;
import com.clinic.appointments.repository.AppointmentRepository;
import com.clinic.appointments.repository.DoctorRepository;
import com.clinic.appointments.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository) {

        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    public Appointment bookAppointment(
            Long doctorId,
            Long patientId,
            LocalDateTime startTime,
            LocalDateTime endTime) {

        validateTime(startTime, endTime);

        checkDoctorAvailability(
                doctorId,
                startTime,
                endTime,
                null
        );

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = new Appointment();

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setStartTime(startTime);
        appointment.setEndTime(endTime);
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setCancellationFee(0);

        return appointmentRepository.save(appointment);
    }

    public Appointment rescheduleAppointment(
            Long appointmentId,
            LocalDateTime newStartTime,
            LocalDateTime newEndTime) {

        validateTime(newStartTime, newEndTime);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new RuntimeException(
                    "Only booked appointments can be rescheduled"
            );
        }

        checkDoctorAvailability(
                appointment.getDoctor().getId(),
                newStartTime,
                newEndTime,
                appointmentId
        );

        appointment.setStartTime(newStartTime);
        appointment.setEndTime(newEndTime);

        return appointmentRepository.save(appointment);
    }

    public Appointment cancelAppointment(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new RuntimeException(
                    "Only booked appointments can be cancelled"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        appointment.setCancelledAt(now);

        /*
         * Late-cancellation rule will be applied here.
         * Exact cutoff and fee should come from the final requirement.
         */
        appointment.setCancellationFee(0);

        appointment.setStatus(AppointmentStatus.CANCELLED);

        return appointmentRepository.save(appointment);
    }

    public Appointment completeAppointment(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new RuntimeException(
                    "Only booked appointments can be completed"
            );
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getDoctorDay(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end) {

        return appointmentRepository
                .findByDoctorIdAndStartTimeBetween(
                        doctorId,
                        start,
                        end
                );
    }

    public List<Appointment> findAppointmentsByPatientName(
            String patientName) {

        return appointmentRepository
                .findByPatientNameIgnoreCase(patientName);
    }

    private void checkDoctorAvailability(
            Long doctorId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            Long excludedAppointmentId) {

        List<Appointment> overlapping =
                appointmentRepository.findOverlappingAppointments(
                        doctorId,
                        startTime,
                        endTime,
                        AppointmentStatus.BOOKED
                );

        boolean conflict = overlapping.stream()
                .anyMatch(appointment ->
                        excludedAppointmentId == null
                                || !appointment.getId()
                                .equals(excludedAppointmentId)
                );

        if (conflict) {
            throw new AppointmentConflictException(
                    "Doctor already has an overlapping appointment"
            );
        }
    }

    private void validateTime(
            LocalDateTime startTime,
            LocalDateTime endTime) {

        if (startTime == null || endTime == null) {
            throw new RuntimeException(
                    "Start time and end time are required"
            );
        }

        if (!endTime.isAfter(startTime)) {
            throw new RuntimeException(
                    "End time must be after start time"
            );
        }
    }
}