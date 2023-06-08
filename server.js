const express = require('express');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const cors = require('cors');
require('dotenv').config();
const { uuid } = require('uuidv4');

const app = express();
const PORT = 8000;

var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Configurar la API Key y el servidor de Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAIL_CHIMP_APIKEY,
  server: 'us17', // por ejemplo, "us1"
});
const listId = process.env.LIST_ID;

// Middleware para analizar los datos JSON del cuerpo de la solicitud
app.use(express.json());
app.use(cors())

// Ruta para agregar un miembro a la lista de Mailchimp
app.post('/api/mailchimp', cors(corsOptions), async (req, res) => {
  const { email, firstName, lastName } = req.body;

  const subscriber = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };

  try {
    const response = await mailchimp.lists.addListMember(listId, subscriber);
    console.log('Miembro agregado:', response);
    res.status(200).json({ message: 'Miembro agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar el miembro:', error);
    res.status(500).json({
      message: 'Error al agregar el miembro',
      error: error });
  } finally {


    const fs = require('fs');

    const newSub = {
      id: uuid(),
      name: email,
      email: firstName,
      phone: lastName
    }


    // Read the existing JSON file
    fs.readFile('mailchimp-data.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }

  try {
        // Parse the JSON data into an array or object
    const jsonData = JSON.parse(data);

    console.log(jsonData)


    // Add the new object to the JSON data
    jsonData.push(newSub);

    // Convert the modified JSON data back to a string
    const updatedData = JSON.stringify(jsonData, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('mailchimp-data.json', updatedData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }
      console.log('Object added successfully!');
    });
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
    });

  }
});

// Ruta de prueba para verificar si el servidor está en funcionamiento
app.get('/api/test', cors(corsOptions), (req, res) => {
  res.status(200).json({
    message: 'Servidor en funcionamiento OK',
    origin: process.env.CORS_ORIGIN
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
