import mysql from "mysql2"; // o require("mysql2") npm i express, fs, csv-parser, node
import fs from 'fs';
import csv from "csv-parser";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Qwe.123*",
  database: "crudRoom"
});

connection.connect((error) => {
  if (error) {
    console.error("Error de conexión:", error);
    return;
  }
  console.log("Conexión exitosa a MySQL");
});

/*fs.createReadStream('data/empleados.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
        console.log('-------------------');


        connection.query("INSERT INTO empleados(id_empleado,empleado_reserva,correo_empleado) VALUES (?,?,?)",[row.id_empleado, row.empleado_reserva, row.correo_empleado],(error, result) => {
            if(error) throw error;


            console.log(result);
        })
    })
*/
/** 
    fs.createReadStream('data/salas.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
        console.log('-------------------');

        connection.query("INSERT INTO salas(id_sala,nombre,capacidad) VALUES (?,?,?)",[row.id_sala, row.nombre, row.capacidad],(error, result) => {
            if(error) throw error;


            console.log(result);
        })
    })
    
    fs.createReadStream('data/responsables.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
        console.log('-------------------');
        
        connection.query("INSERT INTO responsables(id_responsable,nombre_responsable) VALUES (?,?)",[row.id_responsable, row.nombre_responsable],(error, result) => {
            if(error) throw error;
            
            
            console.log(result);
        })
    })
*/

            fs.createReadStream('data/reservas.csv')
    .pipe(csv())
    .on('data', (row) => {
        console.log(row);
        console.log('-------------------');

        connection.query("INSERT INTO reservas(id_sala,id_responsable,id_empleado,fecha_reserva,hora_inicio,hora_fin) VALUES (?,?,?,?,?,?)",[row.id_sala,row.id_responsable,row.id_empleado,row.fecha_reserva,row.hora_inicio,row.hora_fin],(error, result) => {
            if(error) throw error;


            console.log(result);
        })
    })



    /**
     * // Importamos el paquete mysql2 para conectarnos a MySQL
import mysql from "mysql2";

// Importamos el paquete fs para trabajar con archivos (lectura de CSV)
import fs from 'fs';

// Importamos el paquete csv-parser para leer y procesar archivos CSV
import csv from "csv-parser";

// Importamos express para crear un servidor y endpoints
import express from "express";

// Importamos cors para permitir que otros programas (o navegadores) puedan conectarse a nuestro servidor
import cors from "cors";

// Creamos la conexión a la base de datos MySQL con los datos de acceso
const connection = mysql.createConnection({
  host: "localhost",     // Dirección del servidor de base de datos
  user: "root",          // Usuario de MySQL
  password: "Qwe.123*",  // Contraseña del usuario
  database: "crudRoom"   // Base de datos a la que nos conectaremos
});

// Probamos la conexión a MySQL
connection.connect((error) => {
  if (error) {
    console.error("Error de conexión:", error); // Si hay error, lo mostramos
    return; // Detenemos la ejecución
  }
  console.log("Conexión exitosa a MySQL"); // Si todo bien, confirmamos conexión
});

// Creamos la aplicación de Express
const app = express();

// Activamos CORS para que este servidor acepte peticiones desde otros lugares
app.use(cors());

// ================== CARGA DE ARCHIVOS CSV A LA BASE DE DATOS ==================

// Este bloque lee el archivo reservas.csv, línea por línea, y lo inserta en la tabla "reservas"
fs.createReadStream('data/reservas.csv') // Leemos el archivo CSV desde la carpeta data
  .pipe(csv()) // Lo procesamos como formato CSV
  .on('data', (row) => { // Cada vez que lee una fila del CSV...
    console.log(row); // Mostramos la fila en consola
    console.log('-------------------'); // Separador visual

    // Insertamos en la tabla reservas los datos de esa fila
    connection.query(
      "INSERT INTO reservas(id_sala,id_responsable,id_empleado,fecha_reserva,hora_inicio,hora_fin) VALUES (?,?,?,?,?,?)",
      [row.id_sala, row.id_responsable, row.id_empleado, row.fecha_reserva, row.hora_inicio, row.hora_fin],
      (error, result) => {
        if (error) throw error; // Si hay error, detenemos y mostramos el problema
        console.log(result); // Mostramos el resultado de la inserción
      }
    );
  });

// ================== ARRANCAR EL SERVIDOR ==================
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});



// ================== ENDPOINTS CRUD PARA LA TABLA RESERVAS ==================

// 1️⃣ Obtener TODAS las reservas
app.get("/reservas", (req, res) => {
  const sql = "SELECT * FROM reservas";
  connection.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener reservas" });
      return;
    }
    res.json(results); // Devolvemos todas las reservas en formato JSON
  });
});

// 2️⃣ Obtener UNA reserva por su id_reserva
app.get("/reservas/:id", (req, res) => {
  const { id } = req.params; // Tomamos el id desde la URL
  const sql = "SELECT * FROM reservas WHERE id_reserva = ?";
  connection.query(sql, [id], (error, results) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener la reserva" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Reserva no encontrada" });
      return;
    }
    res.json(results[0]); // Devolvemos solo la reserva encontrada
  });
});

// 3️⃣ Crear una NUEVA reserva
app.post("/reservas", express.json(), (req, res) => {
  const { id_sala, id_responsable, id_empleado, fecha_reserva, hora_inicio, hora_fin } = req.body;

  const sql = "INSERT INTO reservas(id_sala, id_responsable, id_empleado, fecha_reserva, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(sql, [id_sala, id_responsable, id_empleado, fecha_reserva, hora_inicio, hora_fin], (error, result) => {
    if (error) {
      res.status(500).json({ error: "Error al crear la reserva" });
      return;
    }
    res.json({ message: "Reserva creada con éxito", id_reserva: result.insertId });
  });
});

// 4️⃣ Actualizar una reserva EXISTENTE
app.put("/reservas/:id", express.json(), (req, res) => {
  const { id } = req.params; // ID de la reserva a actualizar
  const { id_sala, id_responsable, id_empleado, fecha_reserva, hora_inicio, hora_fin } = req.body;

  const sql = "UPDATE reservas SET id_sala=?, id_responsable=?, id_empleado=?, fecha_reserva=?, hora_inicio=?, hora_fin=? WHERE id_reserva=?";
  connection.query(sql, [id_sala, id_responsable, id_empleado, fecha_reserva, hora_inicio, hora_fin, id], (error, result) => {
    if (error) {
      res.status(500).json({ error: "Error al actualizar la reserva" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Reserva no encontrada" });
      return;
    }
    res.json({ message: "Reserva actualizada con éxito" });
  });
});

// 5️⃣ Eliminar una reserva
app.delete("/reservas/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM reservas WHERE id_reserva=?";
  connection.query(sql, [id], (error, result) => {
    if (error) {
      res.status(500).json({ error: "Error al eliminar la reserva" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Reserva no encontrada" });
      return;
    }
    res.json({ message: "Reserva eliminada con éxito" });
  });
});



Cómo probar estos endpoints
Abre Postman o usa fetch desde una página web.

Métodos que puedes probar:

GET http://localhost:3000/reservas → Lista todas las reservas.

GET http://localhost:3000/reservas/1 → Muestra la reserva con ID 1.

POST http://localhost:3000/reservas (en Body → raw → JSON)

{
  "id_sala": 2,
  "id_responsable": 1,
  "id_empleado": 3,
  "fecha_reserva": "2025-08-15",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00"
}


PUT http://localhost:3000/reservas/1 → Modifica la reserva con ID 1.

DELETE http://localhost:3000/reservas/1 → Elimina la reserva con ID 1.




Probar un endpoint con Postman
Supongamos que creaste un endpoint como:


app.get("/empleados", (req, res) => {
    connection.query("SELECT * FROM empleados", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


En Postman:

Haz clic en New Tab.

En el menú desplegable (que dice GET por defecto) selecciona el método que quieres probar (GET, POST, etc.).

En el campo de URL escribe:

http://localhost:3000/empleados


(Cambia 3000 por el puerto que uses)

Presiona el botón Send.

Deberías ver la respuesta en formato JSON en la parte inferior.


Probar un POST
Si tienes un endpoint como:     
app.post("/empleados", (req, res) => {
    const { id_empleado, empleado_reserva, correo_empleado } = req.body;
    connection.query(
        "INSERT INTO empleados(id_empleado, empleado_reserva, correo_empleado) VALUES (?, ?, ?)",
        [id_empleado, empleado_reserva, correo_empleado],
        (err, results) => {
            if (err) throw err;
            res.json({ mensaje: "Empleado agregado", id: results.insertId });
        }
    );
});
En Postman:

Cambia el método a POST.

En la URL escribe:

http://localhost:3000/empleados

Ve a la pestaña Body.

Marca la opción raw y selecciona JSON en la derecha.

Escribe algo como:

{
    "id_empleado": 4,
    "empleado_reserva": "Carlos Pérez",
    "correo_empleado": "carlos@example.com"
}
 Presiona Send y verás la respuesta.

 Probar PUT y DELETE
Para PUT:
Cambias el método a PUT, la URL puede incluir un ID (http://localhost:3000/empleados/4), y envías el JSON actualizado en Body.

Para DELETE:
Cambias el método a DELETE y la URL con el ID (http://localhost:3000/empleados/4).




enviar tu colección de Postman para que otra persona la importe y pruebe, tienes que exportarla primero.

Te lo explico paso a paso:

1. Abrir Postman y buscar tu colección
En el panel izquierdo de Postman, verás tus colecciones bajo Collections.

Localiza la que quieres enviar (por ejemplo: “CRUD Reservas”).

2. Exportar la colección
Haz clic en los tres puntitos ⋮ al lado del nombre de la colección.

Selecciona Export.

Elige el formato Collection v2.1 (es el más usado).

Guarda el archivo .json en tu computadora.

3. Enviar el archivo
Ahora puedes adjuntar ese archivo JSON y enviarlo por correo, WhatsApp, Google Drive o cualquier otro medio.

Quien lo reciba podrá importarlo en Postman y usar tus endpoints directamente.

4. Cómo importarlo (la otra persona)
Abrir Postman.

Dar clic en Import (arriba a la izquierda).

Arrastrar el archivo .json o buscarlo en el explorador.

La colección aparecerá lista en su lista de Collections.
*/

/* ==============================
   CONSULTAS AVANZADAS
================================*/

// 4️⃣ Filtrar reservas por fecha específica
app.get("/reservas/fecha/:fecha", (req, res) => {
  const fecha = req.params.fecha;

  connection.query(
    "SELECT * FROM reservas WHERE fecha_reserva = ?",
    [fecha],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Error al filtrar por fecha" });
        return;
      }
      res.json(results);
    }
  );
});

// 5️⃣ Buscar reservas por nombre del responsable
app.get("/reservas/responsable/:nombre", (req, res) => {
  const nombre = req.params.nombre;

  connection.query(
    `SELECT r.* 
     FROM reservas r
     JOIN responsables resp ON r.id_responsable = resp.id_responsable
     WHERE resp.nombre LIKE ?`,
    [`%${nombre}%`],
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Error al buscar por responsable" });
        return;
      }
      res.json(results);
    }
  );
});

// 6️⃣ Mostrar reservas con datos completos (JOIN con salas y responsables)
app.get("/reservas/detalladas", (req, res) => {
  connection.query(
    `SELECT r.id_reserva, r.fecha_reserva, r.hora_inicio, r.hora_fin,
            s.nombre AS sala, resp.nombre AS responsable
     FROM reservas r
     JOIN salas s ON r.id_sala = s.id_sala
     JOIN responsables resp ON r.id_responsable = resp.id_responsable`,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Error al obtener reservas detalladas" });
        return;
      }
      res.json(results);
    }
  );
});

// 7️⃣ Contar reservas por sala
app.get("/reservas/contador", (req, res) => {
  connection.query(
    `SELECT s.nombre AS sala, COUNT(r.id_reserva) AS total_reservas
     FROM reservas r
     JOIN salas s ON r.id_sala = s.id_sala
     GROUP BY s.nombre`,
    (error, results) => {
      if (error) {
        res.status(500).json({ error: "Error al contar reservas por sala" });
        return;
      }
      res.json(results);
    }
  );
});
