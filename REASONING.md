cat > REASONING.md <<'EOF'
# REASONING.md

# Clinic Appointment System — Reasoning

## 1. Problem Understanding

The system manages doctors, patients, and clinic appointments.

Core requirements:
- Create and manage doctors.
- Create and manage patients.
- Book appointments.
- Prevent overlapping appointments for the same doctor.
- Reschedule appointments with conflict checking.
- Cancel appointments.
- Complete appointments.
- Support notification and automated no-show functionality as required.

## 2. Technology

### Backend
- Java
- Spring Boot
- Spring Data JPA / Hibernate
- PostgreSQL
- Spring Security

### Frontend
- React
- Vite
- JavaScript
- CSS

## 3. Data Model

### Doctor
- id
- name

### Patient
- id
- name

### Appointment
- id
- doctor
- patient
- startTime
- endTime
- status
- cancelledAt
- cancellationFee

Appointment statuses:
- BOOKED
- COMPLETED
- CANCELLED
- NO_SHOW

## 4. Double-Booking Logic

Before creating or rescheduling an appointment, the backend checks whether the selected doctor already has a BOOKED appointment that overlaps the requested time.

Overlap condition:

existing.startTime < requested.endTime
AND
existing.endTime > requested.startTime

This allows adjacent appointments but rejects overlapping appointments.

When a conflict is detected, the API returns HTTP 409 Conflict.

## 5. Rescheduling

A booked appointment can be moved to a new time.

The new slot is checked against other booked appointments while excluding the appointment being rescheduled from its own conflict check.

## 6. Validation

- Start time is required.
- End time is required.
- End time must be after start time.
- Doctor must exist.
- Patient must exist.

## 7. Main APIs

### Health
GET /api/health

### Doctors
GET /api/doctors
POST /api/doctors

### Patients
GET /api/patients
POST /api/patients

### Appointments
POST /api/appointments
GET /api/appointments/doctor/{doctorId}
GET /api/appointments/patient
PUT /api/appointments/{id}/reschedule
PUT /api/appointments/{id}/cancel
PUT /api/appointments/{id}/complete

## 8. Frontend

The frontend provides:
- Doctor count
- Patient count
- Appointment count
- Add Doctor
- Add Patient
- Book Appointment
- Appointment list
- Reschedule
- Cancel
- Complete
- Success and error messages

The frontend communicates with the Spring Boot REST API.

## 9. Submission Flow

1. Create doctor.
2. Create patient.
3. Book appointment.
4. Verify overlapping booking returns HTTP 409.
5. Reschedule appointment.
6. Cancel or complete appointment.
7. Verify updated information in the frontend.

## 10. Scope Note

The exact late-cancellation cutoff and fee amount were not specified in the supplied problem statement, so these values should not be invented without a confirmed requirement.
EOF