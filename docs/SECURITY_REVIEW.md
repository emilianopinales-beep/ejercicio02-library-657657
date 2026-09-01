# Revisión de Seguridad

## Sistema de Librería en Línea

## 1. Objetivo

Revisar los principales riesgos de seguridad de la aplicación y documentar las medidas implementadas para proteger usuarios, credenciales, base de datos, archivos y funciones administrativas.

## 2. Autenticación

El sistema utiliza inicio de sesión mediante correo electrónico y contraseña.

Las contraseñas no se almacenan en texto plano. Se utiliza hash mediante bcrypt antes de guardarlas en PostgreSQL.

Las sesiones son administradas desde la aplicación Node.js mediante express-session.

## 3. Control de acceso

El sistema maneja diferentes roles de usuario:

- visitante
- usuario
- administrador

Las rutas administrativas utilizan middleware para verificar que exista una sesión válida y que el usuario tenga rol de administrador.

Durante las pruebas se confirmó que un usuario con rol `usuario` puede consultar el catálogo, pero recibe acceso denegado si intenta ingresar directamente a `/library/admin`.

## 4. Protección de credenciales

Las credenciales de PostgreSQL y el secreto de sesión se almacenan en el archivo `.env`.

El archivo `.env`:

- no se publica en GitHub;
- está incluido en `.gitignore`;
- permanece únicamente en el servidor;
- tiene permisos restringidos.

El repositorio contiene solamente `.env.example` con valores de ejemplo y sin credenciales reales.

## 5. Usuario de base de datos

La aplicación no utiliza el usuario administrador `postgres`.

Se utiliza el usuario:

`library_user`

con acceso a la base de datos `library`.

Esto reduce los privilegios utilizados por la aplicación durante su ejecución.

## 6. Consultas SQL

Las operaciones realizadas desde Node.js utilizan consultas parametrizadas mediante la biblioteca `pg`.

Esto evita concatenar directamente datos proporcionados por el usuario dentro de las consultas SQL y reduce el riesgo de inyección SQL.

## 7. Integridad de datos

PostgreSQL aplica restricciones para evitar datos inválidos.

Entre las reglas comprobadas se encuentran:

- ISBN único.
- Precio mayor o igual a cero.
- Stock mayor o igual a cero.
- Llaves foráneas válidas.
- Máximo un usuario administrador.
- Máximo una portada principal por libro.

También se realizaron pruebas negativas para confirmar que PostgreSQL rechaza registros que violan estas reglas.

## 8. Seguridad de imágenes

La carga de imágenes está disponible únicamente desde las funciones administrativas.

El sistema permite los formatos:

- JPG/JPEG
- PNG
- WebP

Los archivos se almacenan en la carpeta `uploads`, mientras que PostgreSQL conserva sus metadatos.

El nombre y los datos enviados por el usuario no se utilizan como consultas SQL sin parametrización.

## 9. Exposición de la aplicación

La aplicación Node.js escucha únicamente en:

`127.0.0.1:3000`

El puerto 3000 no se utiliza como punto de acceso público final.

Apache funciona como reverse proxy y publica la aplicación mediante:

`/library/`

Esto evita exponer directamente el proceso Node.js a Internet.

## 10. Servicio del sistema

La aplicación se ejecuta mediante:

`library.service`

administrado por systemd.

Apache y `library.service` están configurados como servicios habilitados y activos.

Esto permite controlar el proceso desde el sistema operativo sin depender de una terminal abierta.

## 11. Aspectos pendientes para un entorno de producción

El despliegue actual utiliza HTTP para fines académicos.

En un sistema de producción se recomienda adicionalmente:

- configurar HTTPS;
- utilizar certificados TLS;
- emplear un almacén persistente de sesiones;
- implementar registros y monitoreo de seguridad;
- establecer políticas de respaldo;
- mantener actualizadas las dependencias del sistema.

## 12. Resultado de la revisión

La aplicación implementa medidas básicas de seguridad adecuadas para el alcance del ejercicio.

Se verificó el control por roles, protección de credenciales, uso de consultas parametrizadas, restricciones de integridad, uso de un usuario de base de datos diferente de `postgres` y despliegue de Node.js detrás de Apache.