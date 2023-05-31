# Define la imagen base
FROM node:14

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia todos los archivos fuente al directorio de trabajo
COPY . .

# Expone el puerto 3000 en el contenedor
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD [ "node", "server.js" ]
