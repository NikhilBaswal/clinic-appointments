package com.clinic.appointments.controller;

import com.clinic.appointments.entity.Appointment;
import com.clinic.appointments.service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Appointment bookAppointment(
            @RequestParam Long doctorId,
            @RequestParam Long patientId,
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime) {

        return appointmentService.bookAppointment(
                doctorId,
                patientId,
                startTime,
                endTime
        );
    }

    @PutMapping("/{id}/reschedule")
    public Appointment rescheduleAppointment(
            @PathVariable Long id,
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime) {

        return appointmentService.rescheduleAppointment(
                id,
                startTime,
                endTime
        );
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancelAppointment(
            @PathVariable Long id) {

        return appointmentService.cancelAppointment(id);
    }

    @PutMapping("/{id}/complete")
    public Appointment completeAppointment(
            @PathVariable Long id) {

        return appointmentService.completeAppointment(id);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getDoctorDay(
            @PathVariable Long doctorId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {

        return appointmentService.getDoctorDay(
                doctorId,
                start,
                end
        );
    }

    @GetMapping("/patient")
    public List<Appointment> findByPatientName(
            @RequestParam String name) {

        return appointmentService.findAppointmentsByPatientName(name);
    }
}