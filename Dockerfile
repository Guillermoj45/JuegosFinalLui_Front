# Etapa única: Desarrollo de la aplicación
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto 4200
EXPOSE 4200

# Comando para ejecutar ng serve
CMD ["npm", "start"]
