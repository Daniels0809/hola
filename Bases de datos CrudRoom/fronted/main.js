import { Script } from "vm";

// URL base del backend
const API_URL = "http://localhost:3000"; // Cambia si tu backend está en otro puerto

// Elementos HTML
const btnCargar = document.getElementById("btn-cargar");
const tablaBody = document.querySelector("#tabla-reservas tbody");
const formAgregar = document.getElementById("form-agregar");

// 1️⃣ Función para cargar reservas (usa el endpoint /reservas/detalladas)
async function cargarReservas() {
  try {
    const res = await fetch(`${API_URL}/reservas/detalladas`);
    const data = await res.json();

    // Limpiar tabla antes de llenar
    tablaBody.innerHTML = "";

    // Recorrer y mostrar en tabla
    data.forEach(reserva => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${reserva.id_reserva}</td>
        <td>${reserva.sala || reserva.id_sala}</td>
        <td>${reserva.responsable || reserva.id_responsable}</td>
        <td>${reserva.fecha_reserva}</td>
        <td>${reserva.hora_inicio}</td>
        <td>${reserva.hora_fin}</td>
      `;
      tablaBody.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al cargar reservas:", error);
  }
}

// 2️⃣ Función para agregar una reserva (POST a /reservas)
formAgregar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevaReserva = {
    id_reserva: document.getElementById("id_reserva").value,
    id_sala: document.getElementById("id_sala").value,
    id_responsable: document.getElementById("id_responsable").value,
    id_empleado: document.getElementById("id_empleado").value,
    fecha_reserva: document.getElementById("fecha_reserva").value,
    hora_inicio: document.getElementById("hora_inicio").value,
    hora_fin: document.getElementById("hora_fin").value,
  };

  try {
    const res = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaReserva)
    });

    if (res.ok) {
      alert("Reserva agregada correctamente");
      formAgregar.reset();
      cargarReservas();
    } else {
      alert("Error al agregar reserva");
    }
  } catch (error) {
    console.error("Error en POST:", error);
  }
});

// 3️⃣ Evento para cargar reservas al hacer clic
btnCargar.addEventListener("click", cargarReservas);


--------------------
//Script.js

const API_URL = "http://localhost:3000/reservas";
let editando = false; // Para saber si es edición o creación

document.addEventListener("DOMContentLoaded", getReservas);

// Obtener todas las reservas
function getReservas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#reservasTable tbody");
            tbody.innerHTML = "";
            data.forEach(r => {
                tbody.innerHTML += `
                    <tr>
                        <td>${r.id_reserva}</td>
                        <td>${r.id_sala}</td>
                        <td>${r.id_responsable}</td>
                        <td>${r.id_empleado}</td>
                        <td>${r.fecha_reserva}</td>
                        <td>${r.hora_inicio}</td>
                        <td>${r.hora_fin}</td>
                        <td>
                            <button onclick="editarReserva(${r.id_reserva})">Editar</button>
                            <button onclick="eliminarReserva(${r.id_reserva})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Error cargando reservas:", err));
}

// Guardar o actualizar reserva
document.getElementById("reservaForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const idReserva = document.getElementById("id_reserva").value;
    const reserva = {
        id_sala: document.getElementById("id_sala").value,
        id_responsable: document.getElementById("id_responsable").value,
        id_empleado: document.getElementById("id_empleado").value,
        fecha_reserva: document.getElementById("fecha_reserva").value,
        hora_inicio: document.getElementById("hora_inicio").value,
        hora_fin: document.getElementById("hora_fin").value
    };

    if (!editando) {
        // Crear nueva
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reserva)
        })
            .then(() => {
                getReservas();
                this.reset();
            })
            .catch(err => console.error("Error agregando reserva:", err));
    } else {
        // Actualizar
        fetch(`${API_URL}/${idReserva}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reserva)
        })
            .then(() => {
                getReservas();
                this.reset();
                editando = false;
                document.querySelector("button[type='submit']").textContent = "Guardar";
            })
            .catch(err => console.error("Error editando reserva:", err));
    }
});

// Editar reserva
function editarReserva(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(r => {
            document.getElementById("id_reserva").value = r.id_reserva;
            document.getElementById("id_sala").value = r.id_sala;
            document.getElementById("id_responsable").value = r.id_responsable;
            document.getElementById("id_empleado").value = r.id_empleado;
            document.getElementById("fecha_reserva").value = r.fecha_reserva;
            document.getElementById("hora_inicio").value = r.hora_inicio;
            document.getElementById("hora_fin").value = r.hora_fin;
            editando = true;
            document.querySelector("button[type='submit']").textContent = "Actualizar";
        })
        .catch(err => console.error("Error cargando reserva:", err));
}

// Eliminar reserva
function eliminarReserva(id) {
    if (confirm("¿Seguro que quieres eliminar esta reserva?")) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
            .then(() => getReservas())
            .catch(err => console.error("Error eliminando reserva:", err));
    }
}

