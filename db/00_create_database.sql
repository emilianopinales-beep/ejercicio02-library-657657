-- EJERCICIO GUIADO 02
-- Creación de la base de datos de la librería
-- Alumno: Emiliano Pascual Pinales Sanchez
-- Matrícula: 657657
--
-- Este script debe ejecutarse con un usuario con permisos
-- para crear bases de datos.
--
-- El rol library_user debe existir previamente.
-- No se incluyen contraseñas en este archivo.

CREATE DATABASE library
    OWNER library_user
    ENCODING 'UTF8';