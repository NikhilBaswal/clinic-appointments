cat > AI_LOGS.md <<'EOF'
# AI_LOGS.md

# AI Development Log

## Project Setup
AI assistance was used to plan and configure the Spring Boot backend and PostgreSQL database.

## Backend Entities
Created the core JPA entities:
- Doctor
- Patient
- Appointment
- AppointmentStatus

Added relationships between appointments, doctors, and patients.

## REST APIs
Implemented REST controllers for:
- Health
- Doctors
- Patients
- Appointments

## Appointment Booking
Implemented:
- Doctor lookup
- Patient lookup
- Start/end time validation
- Appointment creation

## Double-Booking Prevention
Implemented an overlap query for the same doctor.

Overlap rule:

existing.startTime < requested.endTime
AND
existing.endTime > requested.startTime

Added AppointmentConflictException and HTTP 409 Conflict handling.

### Verification
Existing appointment:
10:00–10:30

Attempted overlapping appointment:
10:15–10:45

Result:
HTTP 409 Conflict

## Rescheduling
Implemented:
- New time validation
- Doctor availability re-check
- Exclusion of the appointment being rescheduled

### Verification
Appointment ID 1 was successfully moved to:
11:00–11:30

Result:
HTTP 200

## GitHub Codespaces
The forwarded Spring Boot port initially returned HTTP 403 because port 8080 was private.

The port was changed to public using GitHub Codespaces CLI.

The health endpoint was then successfully accessed through the public Codespaces URL.

## Frontend
Created a React/Vite frontend with:
- Dashboard
- Doctor management
- Patient management
- Appointment booking
- Appointment listing
- Reschedule
- Cancel
- Complete

Connected the frontend to the Spring Boot REST API.

## AI Assistance Summary

AI assistance was used for:
- Architecture planning
- Spring Boot implementation
- JPA repositories and services
- Appointment conflict logic
- Exception handling
- API testing
- Codespaces troubleshooting
- React/Vite frontend scaffolding
- Frontend/backend integration

The project should be reviewed and tested once more before submission.
EOF