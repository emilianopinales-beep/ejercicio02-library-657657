# Historial de Prompts de IA

## Ejercicio Guiado 02 - Librería en Línea

Este documento registra ejemplos representativos de las consultas realizadas a una herramienta de inteligencia artificial durante el desarrollo del proyecto.

La IA se utilizó como apoyo para proponer soluciones, revisar archivos, organizar pruebas y documentar cambios. Cada propuesta fue revisada y probada antes de incorporarse al proyecto.

---

## 1. Diseño y normalización de la base de datos

### Prompt resumido

Ayúdame a diseñar una base de datos PostgreSQL para una librería en línea que permita manejar libros, autores, géneros, formatos, categorías, conceptos, imágenes y usuarios. Debe permitir relaciones muchos a muchos y quedar normalizada hasta 4FN.

### Uso de la respuesta

Se utilizó como apoyo para revisar:

- tablas principales;
- tablas puente;
- claves primarias y foráneas;
- dependencias multivaluadas;
- relación libro-concepto con definición propia;
- restricciones de integridad.

### Validación realizada

El diseño fue comparado con los requerimientos del ejercicio y posteriormente implementado y probado directamente en PostgreSQL.

---

## 2. Autenticación y sesiones

### Prompt resumido

Ayúdame a implementar registro e inicio de sesión en una aplicación monolítica Node.js, Express y EJS conectada directamente a PostgreSQL. Las contraseñas deben almacenarse mediante hash y las rutas administrativas deben estar protegidas.

### Uso de la respuesta

Se utilizó como apoyo para organizar:

- rutas de autenticación;
- servicio de usuarios;
- bcrypt;
- express-session;
- middleware de sesión;
- separación entre usuario y administrador.

### Validación realizada

Se probaron registro, inicio de sesión, cierre de sesión y acceso al catálogo.

También se comprobó que un usuario normal recibe acceso denegado al intentar entrar a `/library/admin`.

---

## 3. CRUD administrativo

### Prompt resumido

Ayúdame a desarrollar las funciones CRUD administrativas manteniendo la aplicación monolítica y utilizando consultas SQL parametrizadas mediante `pg`.

### Uso de la respuesta

Se tomó como apoyo para desarrollar y revisar CRUD de:

- libros;
- autores;
- géneros;
- formatos;
- categorías;
- conceptos;
- usuarios.

### Validación realizada

Cada CRUD fue probado creando un registro temporal, editándolo y eliminándolo posteriormente.

---

## 4. Relaciones entre libros

### Prompt resumido

Ayúdame a implementar la administración de relaciones libro-autor, libro-género y libro-concepto. Los conceptos deben incluir definición y referencia específicas para cada libro.

### Uso de la respuesta

Se utilizó para organizar las rutas, servicios y vistas correspondientes a las relaciones muchos a muchos.

### Validación realizada

Se agregaron y quitaron autores y géneros de libros.

También se agregó un concepto temporal con definición y referencia, y después se eliminó para dejar los datos originales.

---

## 5. Gestión de imágenes

### Prompt resumido

Ayúdame a implementar carga y administración de imágenes JPG, PNG y WebP para los libros. Los archivos deben almacenarse fuera de PostgreSQL y la base de datos debe conservar solamente sus metadatos.

### Uso de la respuesta

Se utilizó como apoyo para:

- carga de archivos;
- almacenamiento en `uploads`;
- registro de metadatos;
- texto alternativo;
- selección de portada;
- edición;
- eliminación.

### Validación realizada

Se subió una imagen real, se mostró como portada en el catálogo y en el detalle del libro, se editaron sus datos y finalmente se eliminó.

---

## 6. Seguridad

### Prompt resumido

Revisa la seguridad básica de la aplicación y señala medidas necesarias para proteger credenciales, rutas administrativas, consultas SQL y archivos.

### Uso de la respuesta

Se utilizó para revisar:

- `.env`;
- `.gitignore`;
- consultas parametrizadas;
- rol administrador;
- usuario `library_user`;
- exposición del puerto 3000;
- carga de imágenes.

### Validación realizada

Se confirmó que `.env` no se publica en GitHub, que la aplicación utiliza `library_user` y que las rutas administrativas están protegidas.

---

## 7. Apache y despliegue

### Prompt resumido

Ayúdame a publicar la aplicación Node.js mediante Apache como reverse proxy, manteniendo Node.js escuchando solamente en `127.0.0.1:3000`.

### Uso de la respuesta

Se utilizó para configurar:

- Apache;
- reverse proxy en `/library`;
- SELinux para permitir la comunicación Apache-Node;
- pruebas mediante `curl`.

### Validación realizada

Se obtuvo respuesta HTTP correcta mediante Apache y posteriormente se accedió a la aplicación desde la IP externa de la VM usando `/library/`.

---

## 8. Servicio systemd

### Prompt resumido

Ayúdame a crear un servicio systemd para ejecutar la aplicación Node.js automáticamente sin depender de una terminal con `npm start`.

### Uso de la respuesta

Se utilizó para crear y habilitar:

`library.service`

### Validación realizada

Se comprobó que:

- `library.service` está `enabled`;
- `library.service` está `active`;
- Apache está `enabled`;
- Apache está `active`;
- la aplicación continúa funcionando sin mantener `npm start` abierto manualmente.

---

## 9. Documentación

### Prompt resumido

Ayúdame a organizar la documentación técnica del proyecto de forma sencilla y consistente con lo que realmente fue implementado.

### Uso de la respuesta

Se utilizó como apoyo para preparar o revisar:

- requerimientos;
- decisiones de ingeniería;
- normalización 4FN;
- plan de pruebas;
- revisión de seguridad;
- arquitectura monolítica;
- documentación del uso de IA.

### Validación realizada

Cada documento fue comparado con la implementación real antes de considerarse terminado.

---

## Conclusión

La inteligencia artificial se utilizó como herramienta de apoyo durante diferentes etapas del proyecto.

Las respuestas obtenidas no se consideraron automáticamente correctas. Cada propuesta fue revisada, adaptada y validada mediante pruebas reales antes de incorporarse al sistema.