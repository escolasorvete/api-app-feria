const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const PORT = 8000;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Ruta para obtener el contenido del archivo JSON
app.get("/api/json", cors(corsOptions), (req, res) => {
  const jsonPath = path.join(__dirname, "segments.json");

  fs.readFile(jsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON:", err);
      res.status(500).json({ error: "Error al leer el archivo JSON" });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      res.status(200).json(jsonData);
    } catch (error) {
      console.error("Error al analizar el contenido del archivo JSON:", error);
      res
        .status(500)
        .json({ error: "Error al analizar el contenido del archivo JSON" });
    }
  });
});

// Ruta para actualizar el contenido del archivo JSON
app.put("/api/json", cors(corsOptions), (req, res) => {
  console.log(req.body);
  const jsonPath = path.join(__dirname, "segments.json");
  const jsonData = JSON.stringify(req.body, null, 2);

  if (!jsonData) {
    console.error("Datos JSON no válidos:", req.body);
    res.status(400).json({ error: "Datos JSON no válidos" });
    return;
  }

  fs.writeFile(jsonPath, jsonData, "utf8", (err) => {
    if (err) {
      console.error("Error al escribir en el archivo JSON:", err);
      res.status(500).json({ error: "Error al escribir en el archivo JSON" });
      return;
    }

    res.status(200).json({ message: "Archivo JSON actualizado correctamente" });
  });
});

// Ruta para eliminar un segmento específico del archivo JSON
app.delete("/api/json/:index", cors(corsOptions), (req, res) => {
  const jsonPath = path.join(__dirname, "segments.json");
  const { index } = req.params;

  fs.readFile(jsonPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON:", err);
      res.status(500).json({ error: "Error al leer el archivo JSON" });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData.segments.splice(index, 1); // Eliminar el segmento del arreglo
      const updatedJsonData = JSON.stringify(jsonData, null, 2);

      fs.writeFile(jsonPath, updatedJsonData, "utf8", (err) => {
        if (err) {
          console.error("Error al escribir en el archivo JSON:", err);
          res
            .status(500)
            .json({ error: "Error al escribir en el archivo JSON" });
          return;
        }

        res.status(200).json({ message: "Segmento eliminado correctamente" });
      });
    } catch (error) {
      console.error("Error al analizar el contenido del archivo JSON:", error);
      res
        .status(500)
        .json({ error: "Error al analizar el contenido del archivo JSON" });
    }
  });
});

app.post('/api/json', cors(corsOptions), (req, res) => {
  console.log(req.body);
  const jsonPath = path.join(__dirname, 'segments.json');
  const { segment } = req.body;

  fs.readFile(jsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo JSON:', err);
      res.status(500).json({ error: 'Error al leer el archivo JSON' });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      jsonData.segments.push(segment); // Agregar el nuevo segmento al arreglo
      const updatedJsonData = JSON.stringify(jsonData, null, 2);

      fs.writeFile(jsonPath, updatedJsonData, 'utf8', (err) => {
        if (err) {
          console.error('Error al escribir en el archivo JSON:', err);
          res.status(500).json({ error: 'Error al escribir en el archivo JSON' });
          return;
        }

        res.status(200).json({ message: 'Segmento creado correctamente' });
      });
    } catch (error) {
      console.error('Error al analizar el contenido del archivo JSON:', error);
      res
        .status(500)
        .json({ error: 'Error al analizar el contenido del archivo JSON' });
    }
  });
});



app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
