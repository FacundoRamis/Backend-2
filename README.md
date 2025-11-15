Proyecto Backend II - Pre Entrega 1

Alumno: Facundo Ramis
Curso: Backend II - CoderHouse

Descripción del proyecto
  Proyecto base de backend para un ecommerce.
  Incluye registro, login, JWT por cookies y una ruta protegida con Passport.

Tecnologías utilizadas
  Node.js + Express
  MongoDB + Mongoose
  bcrypt
  JSON Web Tokens
  Passport + Passport-JWT
  Dotenv

Estructura del proyecto
src/
  app.js
  server.js
  config/passport.config.js
  dao/models/user.model.js
  routes/sessions.router.js
  utils/bcrypt.js
  utils/jwt.js

Endpoints
  POST /api/sessions/register
  Registra un usuario nuevo con contraseña hasheada.

  POST /api/sessions/login
  Valida credenciales y genera un JWT guardado en cookie jwtCookie.

  GET /api/sessions/current
  Ruta protegida.
  Devuelve los datos del usuario autenticado mediante Passport-JWT.

Cómo ejecutar el proyecto
  Instalar dependencias:
    npm install

  Configurar el archivo .env:
    MONGO_URI=TU_URI_DE_MONGO
    JWT_SECRET=secretCoder
    PORT=8080

Iniciar el servidor:
  npm start
  Probar rutas con Thunder Client / Postman.