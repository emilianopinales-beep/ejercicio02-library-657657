# Ejercicio Guiado 02 - Librería en Línea

**Alumno:** Emiliano Pascual Pinales Sanchez  
**Matrícula:** 657657  
**Materia:** Integración de Aplicaciones Computacionales  

---

## 1. Descripción

Aplicación web monolítica desarrollada con Node.js para administrar una librería en línea.

La solución utiliza:

- Node.js
- Express
- EJS
- PostgreSQL
- Acceso directo a PostgreSQL mediante `pg`
- HTML renderizado del lado del servidor
- Sesiones de usuario
- Contraseñas almacenadas mediante hash

No se utilizan APIs REST, GraphQL, SOAP ni microservicios.

---

## 2. Arquitectura

La aplicación utiliza una macro-arquitectura monolítica.

Internamente el proyecto está organizado por módulos:

- `config/`: conexión y configuración.
- `routes/`: rutas HTTP.
- `services/`: lógica y acceso a datos.
- `middleware/`: autenticación y autorización.
- `views/`: vistas EJS.
- `public/`: recursos públicos.
- `uploads/`: imágenes cargadas.
- `db/`: scripts SQL completos.
- `data/`: esquema y datos iniciales.
- `docs/`: documentación.
- `test/`: pruebas.
- `evidencias/`: evidencias del desarrollo.

---

## 3. Estructura principal

```text
library/
│
├── app.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── README.md
│
├── config/
├── routes/
├── services/
├── middleware/
├── views/
├── public/
├── uploads/
├── db/
├── data/
├── docs/
├── test/
└── evidencias/