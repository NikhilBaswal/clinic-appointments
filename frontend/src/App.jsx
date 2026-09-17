import { useEffect, useState } from "react";
import "./App.css";

const API = "https://special-space-tribble-4jg46ggp9qgxh7gv-8080.app.github.dev/api";

function App() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDoctors();
    loadPatients();
    loadAppointments();
  }, []);

  async function loadDoctors() {
    const res = await fetch(`${API}/doctors`);
    const data = await res.json();
    setDoctors(data);
  }

  async function loadPatients() {
    const res = await fetch(`${API}/patients`);
    const data = await res.json();
    setPatients(data);
  }

  async function loadAppointments() {
    const res = await fetch(
      `${API}/appointments/doctor/1?start=2026-09-18T00:00:00&end=2026-09-19T00:00:00`
    );

    if (res.ok) {
      const data = await res.json();
      setAppointments(data);
    }
  }

  async function createDoctor(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!doctorName.trim()) return;

    const res = await fetch(`${API}/doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: doctorName,
      }),
    });

    if (res.ok) {
      setDoctorName("");
      setMessage("Doctor added successfully");
      loadDoctors();
    } else {
      setError("Failed to add doctor");
    }
  }

  async function createPatient(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!patientName.trim()) return;

    const res = await fetch(`${API}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: patientName,
      }),
    });

    if (res.ok) {
      setPatientName("");
      setMessage("Patient added successfully");
      loadPatients();
    } else {
      setError("Failed to add patient");
    }
  }

  async function bookAppointment(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!doctorId || !patientId || !startTime || !endTime) {
      setError("Please fill all appointment fields");
      return;
    }

    const start = startTime.replace("T", "T");
    const end = endTime.replace("T", "T");

    const url =
      `${API}/appointments` +
      `?doctorId=${doctorId}` +
      `&patientId=${patientId}` +
      `&startTime=${start}` +
      `&endTime=${end}`;

    const res = await fetch(url, {
      method: "POST",
    });

    if (res.ok) {
      setMessage("Appointment booked successfully");
      setDoctorId("");
      setPatientId("");
      setStartTime("");
      setEndTime("");
      loadAppointments();
    } else if (res.status === 409) {
      setError("Doctor already has an overlapping appointment");
    } else {
      setError("Failed to book appointment");
    }
  }

  async function completeAppointment(id) {
    const res = await fetch(`${API}/appointments/${id}/complete`, {
      method: "PUT",
    });

    if (res.ok) {
      setMessage("Appointment completed");
      loadAppointments();
    } else {
      setError("Unable to complete appointment");
    }
  }

  async function cancelAppointment(id) {
    const res = await fetch(`${API}/appointments/${id}/cancel`, {
      method: "PUT",
    });

    if (res.ok) {
      setMessage("Appointment cancelled");
      loadAppointments();
    } else {
      setError("Unable to cancel appointment");
    }
  }

  async function rescheduleAppointment(id) {
    const newStart = prompt(
      "Enter new start time (YYYY-MM-DDTHH:mm)",
      "2026-09-18T12:00"
    );

    if (!newStart) return;

    const newEnd = prompt(
      "Enter new end time (YYYY-MM-DDTHH:mm)",
      "2026-09-18T12:30"
    );

    if (!newEnd) return;

    const url =
      `${API}/appointments/${id}/reschedule` +
      `?startTime=${newStart}` +
      `&endTime=${newEnd}`;

    const res = await fetch(url, {
      method: "PUT",
    });

    if (res.ok) {
      setMessage("Appointment rescheduled");
      loadAppointments();
    } else if (res.status === 409) {
      setError("Doctor has another appointment at this time");
    } else {
      setError("Unable to reschedule appointment");
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Clinic Appointment System</h1>
          <p>Manage doctors, patients and appointments</p>
        </div>

        <div className="status">
          <span></span>
          Backend Connected
        </div>
      </header>

      <main className="container">
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}

        <section className="stats">
          <div className="stat-card">
            <h3>Doctors</h3>
            <strong>{doctors.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Patients</h3>
            <strong>{patients.length}</strong>
          </div>

          <div className="stat-card">
            <h3>Appointments</h3>
            <strong>{appointments.length}</strong>
          </div>
        </section>

        <section className="grid">
          <div className="card">
            <h2>Add Doctor</h2>

            <form onSubmit={createDoctor}>
              <input
                type="text"
                placeholder="Doctor name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />

              <button type="submit">Add Doctor</button>
            </form>

            <div className="list">
              {doctors.map((doctor) => (
                <div className="list-item" key={doctor.id}>
                  <span>👨‍⚕️ {doctor.name}</span>
                  <small>ID: {doctor.id}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Add Patient</h2>

            <form onSubmit={createPatient}>
              <input
                type="text"
                placeholder="Patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />

              <button type="submit">Add Patient</button>
            </form>

            <div className="list">
              {patients.map((patient) => (
                <div className="list-item" key={patient.id}>
                  <span>👤 {patient.name}</span>
                  <small>ID: {patient.id}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card booking">
          <h2>Book Appointment</h2>

          <form onSubmit={bookAppointment}>
            <div className="form-grid">
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
              >
                <option value="">Select Doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>

              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              >
                <option value="">Select Patient</option>

                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>

              <div>
                <label>Start Time</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label>End Time</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <button type="submit">Book Appointment</button>
          </form>
        </section>

        <section className="card">
          <div className="section-header">
            <div>
              <h2>Appointments</h2>
              <p>Upcoming clinic appointments</p>
            </div>

            <button onClick={loadAppointments}>Refresh</button>
          </div>

          {appointments.length === 0 ? (
            <div className="empty">No appointments found</div>
          ) : (
            <div className="appointments">
              {appointments.map((appointment) => (
                <div className="appointment" key={appointment.id}>
                  <div>
                    <h3>{appointment.patient.name}</h3>

                    <p>
                      <b>Doctor:</b> {appointment.doctor.name}
                    </p>

                    <p>
                      <b>Time:</b>{" "}
                      {appointment.startTime.replace("T", " ")} →{" "}
                      {appointment.endTime.substring(11)}
                    </p>
                  </div>

                  <div className="appointment-right">
                    <span
                      className={`badge ${appointment.status.toLowerCase()}`}
                    >
                      {appointment.status}
                    </span>

                    {appointment.status === "BOOKED" && (
                      <div className="actions">
                        <button
                          onClick={() =>
                            rescheduleAppointment(appointment.id)
                          }
                        >
                          Reschedule
                        </button>

                        <button
                          className="danger"
                          onClick={() =>
                            cancelAppointment(appointment.id)
                          }
                        >
                          Cancel
                        </button>

                        <button
                          className="success-btn"
                          onClick={() =>
                            completeAppointment(appointment.id)
                          }
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;