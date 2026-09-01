# Registro de Cambios Apoyados con IA

## Ejercicio Guiado 02 - Librería en Línea

Este documento registra cambios relevantes del proyecto en los que se utilizó inteligencia artificial como herramienta de apoyo.

Cada cambio fue revisado y validado antes de considerarse terminado.

---

## Cambio 1 - Normalización de la base de datos

### Objetivo

Organizar el modelo de datos hasta Cuarta Forma Normal (4FN).

### Apoyo de IA

Se utilizó IA para revisar dependencias funcionales y multivaluadas, así como la separación de relaciones entre libros, autores, géneros, conceptos e imágenes.

### Cambio realizado

Se definieron tablas principales y tablas puente:

- libro_autor
- libro_genero
- libro_concepto

También se mantuvieron imágenes como registros independientes asociados a cada libro.

### Validación

El modelo fue implementado en PostgreSQL y se comprobaron claves primarias, foráneas y restricciones de integridad.

### Riesgo revisado

Que el modelo propuesto no coincidiera con los requerimientos reales del proyecto.

---

## Cambio 2 - Autenticación y control de acceso

### Objetivo

Permitir registro, inicio de sesión y separación entre usuarios normales y administrador.

### Apoyo de IA

Se utilizó IA como apoyo para organizar las rutas, sesiones, middleware y uso de bcrypt.

### Cambio realizado

Se implementaron:

- registro de usuario;
- inicio de sesión;
- cierre de sesión;
- sesiones;
- protección de rutas administrativas.

### Validación

Se comprobó que un usuario normal puede ingresar al catálogo pero recibe acceso denegado al intentar entrar a `/library/admin`.

### Riesgo revisado

Permitir que un usuario sin permisos accediera a funciones administrativas.

---

## Cambio 3 - CRUD administrativo

### Objetivo

Permitir que el administrador gestione la información del sistema.

### Apoyo de IA

Se utilizó IA para revisar rutas, servicios, vistas y consultas SQL parametrizadas.

### Cambio realizado

Se implementaron operaciones CRUD para:

- libros;
- autores;
- géneros;
- formatos;
- categorías;
- conceptos;
- usuarios.

### Validación

Se crearon registros temporales, se editaron y posteriormente se eliminaron.

### Riesgo revisado

Modificar o eliminar información incorrecta por errores en identificadores o consultas SQL.

---

## Cambio 4 - Relaciones de libros

### Objetivo

Permitir múltiples autores, géneros y conceptos asociados a un mismo libro.

### Apoyo de IA

Se utilizó IA para organizar el manejo de relaciones muchos a muchos.

### Cambio realizado

Se implementó administración de:

- libro_autor;
- libro_genero;
- libro_concepto.

Los conceptos incluyen definición y referencia específicas para cada libro.

### Validación

Se agregaron y quitaron relaciones temporalmente y se comprobó el resultado en la aplicación y en PostgreSQL.

### Riesgo revisado

Generar relaciones duplicadas o inconsistentes.

---

## Cambio 5 - Gestión de imágenes

### Objetivo

Permitir imágenes asociadas a libros.

### Apoyo de IA

Se utilizó IA como apoyo para revisar el manejo de archivos y metadatos.

### Cambio realizado

Se implementaron:

- carga de JPG/JPEG, PNG y WebP;
- almacenamiento en `uploads`;
- registro de metadatos;
- texto alternativo;
- portada principal;
- edición;
- eliminación.

### Validación

Se cargó una imagen real, se mostró en catálogo y detalle, se editaron sus datos y posteriormente se eliminó.

### Riesgo revisado

Aceptar formatos no permitidos o mantener archivos que ya no correspondieran a registros existentes.

---

## Cambio 6 - Seguridad

### Objetivo

Reducir riesgos básicos de seguridad.

### Apoyo de IA

Se utilizó IA para revisar credenciales, permisos, consultas SQL y exposición de servicios.

### Cambio realizado

Se verificó:

- uso de `.env`;
- exclusión de `.env` en Git;
- consultas parametrizadas;
- uso de `library_user`;
- protección de rutas administrativas;
- Node.js escuchando solamente en `127.0.0.1:3000`.

### Validación

Se realizaron pruebas de acceso, integridad de datos y revisión del repositorio.

### Riesgo revisado

Exposición de credenciales, acceso no autorizado e inyección SQL.

---

## Cambio 7 - Apache como reverse proxy

### Objetivo

Publicar la aplicación sin exponer directamente Node.js.

### Apoyo de IA

Se utilizó IA para orientar la configuración y las pruebas del reverse proxy.

### Cambio realizado

Apache publica:

`/library/`

y redirige internamente hacia:

`127.0.0.1:3000/library/`

También se habilitó la comunicación necesaria mediante SELinux.

### Validación

Se obtuvo respuesta HTTP correcta mediante Apache y se accedió a la aplicación mediante la IP pública de la VM.

### Riesgo revisado

Dejar expuesto directamente el puerto de Node.js.

---

## Cambio 8 - Servicio systemd

### Objetivo

Evitar depender de una terminal abierta con `npm start`.

### Apoyo de IA

Se utilizó IA como apoyo para crear y revisar el servicio.

### Cambio realizado

Se creó:

`library.service`

y se configuró para iniciar automáticamente.

### Validación

Se comprobó que:

- `library.service` está activo;
- `library.service` está habilitado;
- Apache está activo;
- Apache está habilitado;
- la aplicación continúa funcionando sin una terminal ejecutando `npm start`.

### Riesgo revisado

Que existieran dos procesos Node.js utilizando el mismo puerto.

---

## Resultado

Los cambios apoyados con inteligencia artificial fueron incorporados únicamente después de ser revisados y comprobados mediante pruebas.

La IA se utilizó como herramienta de apoyo y documentación, mientras que la validación final se realizó sobre la aplicación y la infraestructura implementadas.