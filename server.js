const express = require('express');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 8000;

var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Configurar la API Key y el servidor de Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAIL_CHIMP_APIKEY,
  server: process.env.SERVER, // por ejemplo, "us1"
});
const listId = process.env.LIST_ID;

// Middleware para analizar los datos JSON del cuerpo de la solicitud
app.use(express.json());

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
    res.status(500).json({ error: 'Error al agregar el miembro' });
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
