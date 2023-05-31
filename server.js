const express = require('express');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(cors({
  origin: 'http://localhost:3000'
})); // Habilitar CORS

// Configurar la API Key y el servidor de Mailchimp
mailchimp.setConfig({
  apiKey: '9075a4905c4a305aa0950574558ab8fa-us17',
  server: 'us17', // por ejemplo, "us1"
});
const listId = '909141cea0';

// Middleware para analizar los datos JSON del cuerpo de la solicitud
app.use(express.json());

// Ruta para agregar un miembro a la lista de Mailchimp
app.post('/api/mailchimp', async (req, res) => {
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
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Servidor en funcionamiento' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
