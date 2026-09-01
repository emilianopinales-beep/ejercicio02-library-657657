# Prompt Maestro de IA

## Ejercicio Guiado 02 - Librería en Línea

### Objetivo

Utilizar inteligencia artificial como herramienta de apoyo durante el desarrollo y revisión del sistema, manteniendo el control de los cambios y validando manualmente cada resultado antes de incorporarlo al proyecto.

### Prompt maestro

Ayúdame a desarrollar y revisar una aplicación web monolítica de librería en línea para la materia Integración de Aplicaciones Computacionales.

El proyecto debe cumplir con las siguientes condiciones:

- Utilizar Node.js, Express y EJS.
- Mantener una arquitectura monolítica organizada por módulos.
- Conectarse directamente a PostgreSQL mediante la biblioteca pg.
- Utilizar consultas SQL parametrizadas.
- No utilizar REST, GraphQL, SOAP ni microservicios.
- Manejar visitantes, usuarios registrados y un máximo de un administrador.
- Incluir registro, inicio y cierre de sesión.
- Permitir consulta y búsqueda del catálogo por título o ISBN.
- Permitir al administrador realizar operaciones CRUD.
- Manejar libros, autores, géneros, formatos, categorías, conceptos, imágenes y relaciones entre estas entidades.
- Permitir varios autores y géneros por libro.
- Permitir conceptos asociados a libros con definición y referencia.
- Permitir imágenes JPG, PNG y WebP.
- Mantener la base de datos normalizada hasta 4FN.
- Aplicar restricciones de integridad en PostgreSQL.
- Proteger las rutas administrativas mediante autenticación y autorización.
- Mantener credenciales fuera del repositorio mediante un archivo .env.
- Ejecutar Node.js únicamente en 127.0.0.1:3000.
- Utilizar Apache como reverse proxy para publicar /library.
- Mantener la solución sencilla, clara y adecuada para un proyecto académico.

Cuando propongas un cambio:

1. Indica qué archivo debe modificarse.
2. Entrega el contenido completo del archivo cuando sea necesario reemplazarlo.
3. No agregues tecnologías o dependencias que no sean necesarias.
4. Conserva la estructura y nombres existentes del proyecto.
5. Explica brevemente el propósito del cambio.
6. Indica una prueba sencilla para comprobar que funciona.
7. No incluyas contraseñas, secretos, tokens ni información sensible.
8. Señala cualquier riesgo o efecto que deba revisarse antes de aplicar el cambio.

Las sugerencias de IA deben considerarse propuestas de apoyo. Cada cambio debe ser revisado, ejecutado y comprobado antes de considerarse terminado.