<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>CRUD Reservas</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Gestión de Facturas</h1>

    <form id="facturaForm">
        <input type="hidden" id="invoice_id" />
        <input type="text" id="id_transaction" placeholder="Id id_transaction" required>
        <input type="text" id="id_client" placeholder="id_client" required>
        <input type="text" id="billing_period" placeholder="billing_period" required>
        <input type="number" id="billed_amount" required>
        <input type="number" id="amount_paid" required>
        <button type="submit">Save</button>
    </form>

    <table id="invoicesTable" border="1">
        <thead>
            <tr>
                <th>ID invoices</th>
                <th>ID transaction</th>
                <th>ID client</th>
                <th>billing period</th>
                <th>billed amount</th>
                <th>amount_paid</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>

    <script src="./main.js"></script>
</body>
</html>






const API_URL = "http://localhost:3000/invoices";
let editando = false; // Para saber si es edición o creación

document.addEventListener("DOMContentLoaded", getInvoices);

// Obtener todas las reservas
function getInvoices() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector("#invoicesTable tbody");
            tbody.innerHTML = "";
            data.forEach(r => {
                tbody.innerHTML += `
                    <tr>
                        <td>${r.invoice_id}</td>
                        <td>${r.id_transaction}</td>
                        <td>${r.id_client }</td>
                        <td>${r.billing_period}</td>
                        <td>${r.billed_amount}</td>
                        <td>${r.amount_paid}</td>                        
                        <td>
                            <button onclick="editarFactura(${r.invoice_id})">Editar</button>
                            <button onclick="eliminarFactura(${r.invoice_id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Error cargando factura:", err));
}

// Guardar o actualizar reserva
document.getElementById("invoicesForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const idInvoices = document.getElementById("invoice_id").value;
    const invoices = {
        id_transaction: document.getElementById("id_transaction").value,
        id_client: document.getElementById("id_client").value,
        billing_period: document.getElementById("billing_period").value,
        billed_amount: document.getElementById("billed_amount").value,
        amount_paid: document.getElementById("amount_paid").value,
    };

    if (!editando) {
        // Crear nueva
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoices)
        })
            .then(() => {
                getInvoices();
                this.reset();
            })
            .catch(err => console.error("Error agregando invoices:", err));
    } else {
        // Actualizar
        fetch(`${API_URL}/${idInvoices}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoices)
        })
            .then(() => {
                getInvoices();
                this.reset();
                editando = false;
                document.querySelector("button[type='submit']").textContent = "Guardar";
            })
            .catch(err => console.error("Error editando factura:", err));
    }
});

// Editar reserva
function editarInvoices(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(r => {
            document.getElementById("invoice_id").value = r.invoice_id;
            document.getElementById("id_transaction").value = r.id_transaction;
            document.getElementById("id_client").value = r.id_client;
            document.getElementById("billing_period").value = r.billing_period;
            document.getElementById("billed_amount").value = r.billed_amount;
            document.getElementById("amount_paid").value = r.amount_paid;
            editando = true;
            document.querySelector("button[type='submit']").textContent = "Actualizar";
        })
        .catch(err => console.error("Error cargando factura:", err));
}

// Eliminar reserva
function eliminarInvoices(id) {
    if (confirm("¿Seguro que quieres eliminar esta factura?")) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
            .then(() => getInvoices())
            .catch(err => console.error("Error eliminando factura:", err));
    }
}

import mysql from "mysql2"; // o require("mysql2") npm i express, fs, csv-parser, node
import fs from 'fs';
import csv from "csv-parser";
import express from "express";
import cors from "cors";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Qwe.123*",
  database: "transactions"
});

connection.connect((error) => {
  if (error) {
    console.error("Error de conexión:", error);
    return;
  }
  console.log("Conexión exitosa a MySQL");
});

const app = express();

app.use(cors());

fs.createReadStream('data/clients.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
    console.log('-------------------');


    connection.query("INSERT INTO clients(id_client,client_name,address,phone,email,platform_used) VALUES (?,?,?,?,?,?)", [row.id_client, row.client_name, row.address, row.phone, row.email, row.platform_used], (error, result) => {
      if (error) throw error;


      console.log(result);
    })
  })


fs.createReadStream('data/transaction_status.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
    console.log('-------------------');


    connection.query("INSERT INTO transaction_status(id_status,transaction_status) VALUES (?,?)", [row.id_status, row.transaction_status], (error, result) => {
      if (error) throw error;


      console.log(result);
    })
  })

fs.createReadStream('data/transactions.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
    console.log('-------------------');


    connection.query("INSERT INTO transactions(id_transaction,transaction_date,transaction_amount,id_status,transaction_type) VALUES (?,?,?,?,?)", [row.id_transaction, row.transaction_date, row.transaction_amount, row.id_status, row.transaction_type], (error, result) => {
      if (error) throw error;


      console.log(result);
    })
  })

fs.createReadStream('data/invoices.csv')
  .pipe(csv())
  .on('data', (row) => {
    console.log(row);
    console.log('-------------------');

    connection.query("INSERT INTO invoices(invoice_id,id_transaction,id_client,billing_period,billed_amount,amount_paid ) VALUES (?,?,?,?,?,?)", [row.invoice_id, row.id_transaction, row.id_client, row.billing_period, row.billed_amount, row.amount_paid], (error, result) => {
      if (error) throw error;


      console.log(result);
    })
  })


// ================== ARRANCAR EL SERVIDOR ==================
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

app.get("/invoices", (req, res) => {
const sql = "SELECT * FROM invoices";
connection.query(sql, (error, results) => {
if (error) {
  res.status(500).json({ error: "Error al obtener facturas" });
  return;
}
res.json(results); // Devolvemos todas las reservas en formato JSON
});
});

// 2️⃣ Obtener UNA reserva por su id_reserva
app.get("/invoices/:id", (req, res) => {
const { id } = req.params; // Tomamos el id desde la URL
const sql = "SELECT * FROM invoices WHERE invoice_id = ?";
connection.query(sql, [id], (error, results) => {
if (error) {
  res.status(500).json({ error: "Error al obtener la factura" });
  return;
}
if (results.length === 0) {
  res.status(404).json({ message: "Factura no encontrada" });
  return;
}
res.json(results[0]); // Devolvemos solo la factura encontrada
});
});

// 3️⃣ Crear una NUEVA factura
app.post("/invoice", express.json(), (req, res) => {
const { id_transaction, id_client, billing_period, billed_amount, amount_paid} = req.body;

const sql = "INSERT INTO invoice(id_transaction, id_client, billing_period, billed_amount, amount_paid) VALUES (?, ?, ?, ?, ?)";
connection.query(sql, [id_transaction, id_client, billing_period, billed_amount, amount_paid], (error, result) => {
if (error) {
  res.status(500).json({ error: "Error al crear la reserva" });
  return;
}
res.json({ message: "Reserva creada con éxito", invoice_id: result.insertId });
});
});

// 4️⃣ Actualizar una reserva EXISTENTE
app.put("/invoices/:id", express.json(), (req, res) => {
const { id } = req.params; // ID de la reserva a actualizar
const { id_transaction, id_client, billing_period, billed_amount, amount_paid } = req.body;

const sql = "UPDATE reservas SET id_transaction=?, id_client=?, billing_period=?, billed_amount=?, amount_paid=? WHERE invoice_id=?";
connection.query(sql, [id_transaction, id_client, billing_period, billed_amount, amount_paid, id], (error, result) => {
if (error) {
  res.status(500).json({ error: "Error al actualizar la factura" });
  return;
}
if (result.affectedRows === 0) {
  res.status(404).json({ message: "factura no encontrada" });
  return;
}
res.json({ message: "factura actualizada con éxito" });
});
});

// 5️⃣ Eliminar una reserva
app.delete("/invoice/:id", (req, res) => {
const { id } = req.params;

const sql = "DELETE FROM invoice WHERE invoice_id=?";
connection.query(sql, [id], (error, result) => {
if (error) {
  res.status(500).json({ error: "Error al eliminar la factura" });
  return;
}
if (result.affectedRows === 0) {
  res.status(404).json({ message: "factura no encontrada" });
  return;
}
res.json({ message: "factura eliminada con éxito" });
});
});
