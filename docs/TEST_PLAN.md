# Plan de Pruebas

## Sistema de Librería en Línea

Este documento resume las pruebas realizadas para comprobar el funcionamiento de la aplicación monolítica, la base de datos PostgreSQL, los permisos de usuarios y el despliegue mediante Apache.

## 1. Objetivo

Comprobar que las funciones principales del sistema operen correctamente y que se respeten las reglas de integridad y seguridad definidas para la aplicación.

## 2. Pruebas funcionales

| ID | Prueba | Resultado esperado | Resultado |
|---|---|---|---|
| P01 | Registro de usuario | Crear una cuenta con rol usuario | Correcto |
| P02 | Inicio de sesión | Permitir acceso con credenciales válidas | Correcto |
| P03 | Catálogo de libros | Mostrar los 30 libros registrados | Correcto |
| P04 | Búsqueda por título | Mostrar solamente los libros coincidentes | Correcto |
| P05 | Búsqueda por ISBN | Localizar el libro correspondiente | Correcto |
| P06 | Detalle del libro | Mostrar información, conceptos e imágenes | Correcto |
| P07 | CRUD de libros | Crear, consultar, editar y eliminar libros | Correcto |
| P08 | CRUD de autores | Crear, consultar, editar y eliminar autores | Correcto |
| P09 | CRUD de géneros | Crear, consultar, editar y eliminar géneros | Correcto |
| P10 | CRUD de formatos | Crear, consultar, editar y eliminar formatos | Correcto |
| P11 | CRUD de categorías | Crear, consultar, editar y eliminar categorías | Correcto |
| P12 | CRUD de conceptos | Crear, consultar, editar y eliminar conceptos | Correcto |
| P13 | CRUD de usuarios | Crear, consultar, editar y eliminar usuarios | Correcto |
| P14 | Relaciones libro-autor | Agregar y quitar autores de un libro | Correcto |
| P15 | Relaciones libro-género | Agregar y quitar géneros de un libro | Correcto |
| P16 | Relaciones libro-concepto | Agregar concepto con definición y referencia | Correcto |
| P17 | Subida de imagen | Guardar archivo JPG, PNG o WebP y sus metadatos | Correcto |
| P18 | Edición de imagen | Modificar texto alternativo y portada | Correcto |
| P19 | Eliminación de imagen | Eliminar registro y archivo temporal | Correcto |

## 3. Pruebas de seguridad y permisos

| ID | Prueba | Resultado esperado | Resultado |
|---|---|---|---|
| S01 | Usuario normal accede al catálogo | Acceso permitido | Correcto |
| S02 | Usuario normal intenta entrar a /admin | Acceso denegado | Correcto |
| S03 | Máximo un administrador | La base de datos rechaza un segundo administrador | Correcto |
| S04 | Archivo .env | No debe publicarse en GitHub | Correcto |
| S05 | Usuario de base de datos | La aplicación utiliza library_user y no postgres | Correcto |

## 4. Pruebas de integridad de base de datos

| ID | Prueba | Resultado esperado | Resultado |
|---|---|---|---|
| BD01 | ISBN duplicado | PostgreSQL rechaza el registro | Correcto |
| BD02 | Precio negativo | PostgreSQL rechaza el valor | Correcto |
| BD03 | Stock negativo | PostgreSQL rechaza el valor | Correcto |
| BD04 | Llave foránea inválida | PostgreSQL rechaza la relación | Correcto |
| BD05 | Eliminar registro referenciado | PostgreSQL protege la integridad referencial | Correcto |
| BD06 | Una portada por libro | La base evita más de una portada principal | Correcto |
| BD07 | Stored procedure de stock | Actualiza correctamente dentro de una transacción | Correcto |
| BD08 | Vistas de consulta | Devuelven los datos esperados del catálogo | Correcto |

## 5. Pruebas de despliegue

| ID | Prueba | Resultado esperado | Resultado |
|---|---|---|---|
| D01 | Node.js en 127.0.0.1:3000 | Aplicación disponible localmente en la VM | Correcto |
| D02 | Apache reverse proxy | /library responde mediante Apache | Correcto |
| D03 | Servicio systemd | library.service permanece activo sin npm start manual | Correcto |
| D04 | Inicio automático | httpd y library aparecen enabled y active | Correcto |
| D05 | Acceso público | La aplicación abre mediante la IP externa en /library/ | Correcto |

## 6. Resultado general

Las pruebas realizadas confirmaron el funcionamiento correcto de las funciones principales del sistema, las operaciones CRUD, las relaciones entre tablas, la carga de imágenes, las restricciones de integridad, el control de permisos y el despliegue de la aplicación mediante Apache.

Los registros temporales utilizados durante las pruebas fueron eliminados al terminar, dejando la base de datos con sus datos originales.