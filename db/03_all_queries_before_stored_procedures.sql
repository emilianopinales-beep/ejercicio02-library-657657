-- EJERCICIO GUIADO 02
-- Consultas SQL utilizadas antes de procedimientos almacenados
-- Alumno: Emiliano Pascual Pinales Sanchez
-- Matrícula: 657657
--
-- NOTA:
-- Los parámetros $1, $2, $3, etc. están preparados para utilizarse
-- desde Node.js con la librería pg.
-- Este archivo documenta las consultas que utilizará el monolito.

-- =========================================================
-- 1. USUARIOS
-- =========================================================

-- Registrar usuario
INSERT INTO usuario
(nombre, email, password_hash, rol)
VALUES ($1, $2, $3, 'usuario')
RETURNING usuario_id, nombre, email, rol;

-- Buscar usuario por correo para inicio de sesión
SELECT
    usuario_id,
    nombre,
    email,
    password_hash,
    rol,
    activo
FROM usuario
WHERE email = $1;

-- Consultar todos los usuarios
SELECT
    usuario_id,
    nombre,
    email,
    rol,
    activo,
    fecha_registro
FROM usuario
ORDER BY usuario_id;

-- Consultar usuario por ID
SELECT
    usuario_id,
    nombre,
    email,
    rol,
    activo,
    fecha_registro
FROM usuario
WHERE usuario_id = $1;

-- Modificar usuario
UPDATE usuario
SET
    nombre = $1,
    email = $2,
    rol = $3,
    activo = $4
WHERE usuario_id = $5
RETURNING usuario_id;

-- Eliminar usuario
DELETE FROM usuario
WHERE usuario_id = $1;


-- =========================================================
-- 2. FORMATOS
-- =========================================================

-- Crear formato
INSERT INTO formato (nombre)
VALUES ($1)
RETURNING formato_id;

-- Consultar formatos
SELECT formato_id, nombre
FROM formato
ORDER BY nombre;

-- Modificar formato
UPDATE formato
SET nombre = $1
WHERE formato_id = $2
RETURNING formato_id;

-- Eliminar formato
DELETE FROM formato
WHERE formato_id = $1;


-- =========================================================
-- 3. CATEGORÍAS
-- =========================================================

-- Crear categoría
INSERT INTO categoria (nombre)
VALUES ($1)
RETURNING categoria_id;

-- Consultar categorías
SELECT categoria_id, nombre
FROM categoria
ORDER BY nombre;

-- Modificar categoría
UPDATE categoria
SET nombre = $1
WHERE categoria_id = $2
RETURNING categoria_id;

-- Eliminar categoría
DELETE FROM categoria
WHERE categoria_id = $1;


-- =========================================================
-- 4. AUTORES
-- =========================================================

-- Crear autor
INSERT INTO autor
(nombre, nacionalidad)
VALUES ($1, $2)
RETURNING autor_id;

-- Consultar autores
SELECT
    autor_id,
    nombre,
    nacionalidad
FROM autor
ORDER BY nombre;

-- Consultar autor por ID
SELECT
    autor_id,
    nombre,
    nacionalidad
FROM autor
WHERE autor_id = $1;

-- Modificar autor
UPDATE autor
SET
    nombre = $1,
    nacionalidad = $2
WHERE autor_id = $3
RETURNING autor_id;

-- Eliminar autor
DELETE FROM autor
WHERE autor_id = $1;


-- =========================================================
-- 5. GÉNEROS
-- =========================================================

-- Crear género
INSERT INTO genero (nombre)
VALUES ($1)
RETURNING genero_id;

-- Consultar géneros
SELECT genero_id, nombre
FROM genero
ORDER BY nombre;

-- Modificar género
UPDATE genero
SET nombre = $1
WHERE genero_id = $2
RETURNING genero_id;

-- Eliminar género
DELETE FROM genero
WHERE genero_id = $1;


-- =========================================================
-- 6. CONCEPTOS
-- =========================================================

-- Crear concepto
INSERT INTO concepto (nombre)
VALUES ($1)
RETURNING concepto_id;

-- Consultar conceptos
SELECT concepto_id, nombre
FROM concepto
ORDER BY nombre;

-- Modificar concepto
UPDATE concepto
SET nombre = $1
WHERE concepto_id = $2
RETURNING concepto_id;

-- Eliminar concepto
DELETE FROM concepto
WHERE concepto_id = $1;


-- =========================================================
-- 7. LIBROS
-- =========================================================

-- Crear libro
INSERT INTO libro
(
    isbn,
    titulo,
    anio_publicacion,
    precio,
    stock,
    formato_id,
    categoria_id
)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING libro_id;

-- Consultar libros
SELECT
    l.libro_id,
    l.isbn,
    l.titulo,
    l.anio_publicacion,
    l.precio,
    l.stock,
    f.nombre AS formato,
    c.nombre AS categoria
FROM libro l
JOIN formato f
    ON f.formato_id = l.formato_id
JOIN categoria c
    ON c.categoria_id = l.categoria_id
ORDER BY l.titulo;

-- Consultar libro por ID
SELECT
    l.libro_id,
    l.isbn,
    l.titulo,
    l.anio_publicacion,
    l.precio,
    l.stock,
    l.formato_id,
    f.nombre AS formato,
    l.categoria_id,
    c.nombre AS categoria
FROM libro l
JOIN formato f
    ON f.formato_id = l.formato_id
JOIN categoria c
    ON c.categoria_id = l.categoria_id
WHERE l.libro_id = $1;

-- Buscar libro por ISBN exacto
SELECT
    libro_id,
    isbn,
    titulo,
    anio_publicacion,
    precio,
    stock
FROM libro
WHERE isbn = $1;

-- Buscar libros por título
SELECT
    libro_id,
    isbn,
    titulo,
    anio_publicacion,
    precio,
    stock
FROM libro
WHERE titulo ILIKE '%' || $1 || '%'
ORDER BY titulo;

-- Modificar libro
UPDATE libro
SET
    isbn = $1,
    titulo = $2,
    anio_publicacion = $3,
    precio = $4,
    stock = $5,
    formato_id = $6,
    categoria_id = $7
WHERE libro_id = $8
RETURNING libro_id;

-- Actualizar únicamente stock
UPDATE libro
SET stock = $1
WHERE libro_id = $2
RETURNING libro_id, stock;

-- Actualizar únicamente precio
UPDATE libro
SET precio = $1
WHERE libro_id = $2
RETURNING libro_id, precio;

-- Eliminar libro
DELETE FROM libro
WHERE libro_id = $1;


-- =========================================================
-- 8. RELACIÓN LIBRO - AUTOR
-- =========================================================

-- Asociar autor a libro
INSERT INTO libro_autor
(libro_id, autor_id)
VALUES ($1, $2);

-- Consultar autores de un libro
SELECT
    a.autor_id,
    a.nombre,
    a.nacionalidad
FROM libro_autor la
JOIN autor a
    ON a.autor_id = la.autor_id
WHERE la.libro_id = $1
ORDER BY a.nombre;

-- Eliminar asociación libro-autor
DELETE FROM libro_autor
WHERE libro_id = $1
AND autor_id = $2;


-- =========================================================
-- 9. RELACIÓN LIBRO - GÉNERO
-- =========================================================

-- Asociar género a libro
INSERT INTO libro_genero
(libro_id, genero_id)
VALUES ($1, $2);

-- Consultar géneros de un libro
SELECT
    g.genero_id,
    g.nombre
FROM libro_genero lg
JOIN genero g
    ON g.genero_id = lg.genero_id
WHERE lg.libro_id = $1
ORDER BY g.nombre;

-- Eliminar asociación libro-género
DELETE FROM libro_genero
WHERE libro_id = $1
AND genero_id = $2;


-- =========================================================
-- 10. RELACIÓN LIBRO - CONCEPTO
-- =========================================================

-- Asociar concepto y definición a libro
INSERT INTO libro_concepto
(
    libro_id,
    concepto_id,
    definicion,
    referencia
)
VALUES ($1, $2, $3, $4);

-- Consultar conceptos de un libro
SELECT
    c.concepto_id,
    c.nombre,
    lc.definicion,
    lc.referencia
FROM libro_concepto lc
JOIN concepto c
    ON c.concepto_id = lc.concepto_id
WHERE lc.libro_id = $1
ORDER BY c.nombre;

-- Modificar definición
UPDATE libro_concepto
SET
    definicion = $1,
    referencia = $2
WHERE libro_id = $3
AND concepto_id = $4;

-- Eliminar concepto de libro
DELETE FROM libro_concepto
WHERE libro_id = $1
AND concepto_id = $2;


-- =========================================================
-- 11. IMÁGENES
-- =========================================================

-- Registrar metadatos de imagen
INSERT INTO imagen
(
    libro_id,
    nombre_archivo,
    ruta_relativa,
    mime_type,
    tamanio_bytes,
    es_portada,
    texto_alt
)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING imagen_id;

-- Consultar imágenes de un libro
SELECT
    imagen_id,
    nombre_archivo,
    ruta_relativa,
    mime_type,
    tamanio_bytes,
    es_portada,
    texto_alt
FROM imagen
WHERE libro_id = $1
ORDER BY es_portada DESC, imagen_id;

-- Modificar metadatos de imagen
UPDATE imagen
SET
    es_portada = $1,
    texto_alt = $2
WHERE imagen_id = $3
RETURNING imagen_id;

-- Eliminar imagen
DELETE FROM imagen
WHERE imagen_id = $1;


-- =========================================================
-- 12. CATÁLOGO COMPLETO
-- =========================================================

SELECT
    l.libro_id,
    l.isbn,
    l.titulo,
    l.anio_publicacion,
    l.precio,
    l.stock,
    f.nombre AS formato,
    ca.nombre AS categoria,

    STRING_AGG(
        DISTINCT a.nombre,
        ', '
    ) AS autores,

    STRING_AGG(
        DISTINCT g.nombre,
        ', '
    ) AS generos

FROM libro l

JOIN formato f
    ON f.formato_id = l.formato_id

JOIN categoria ca
    ON ca.categoria_id = l.categoria_id

LEFT JOIN libro_autor la
    ON la.libro_id = l.libro_id

LEFT JOIN autor a
    ON a.autor_id = la.autor_id

LEFT JOIN libro_genero lg
    ON lg.libro_id = l.libro_id

LEFT JOIN genero g
    ON g.genero_id = lg.genero_id

GROUP BY
    l.libro_id,
    l.isbn,
    l.titulo,
    l.anio_publicacion,
    l.precio,
    l.stock,
    f.nombre,
    ca.nombre

ORDER BY l.titulo;


-- =========================================================
-- 13. DETALLE COMPLETO DE UN LIBRO
-- =========================================================

SELECT
    l.libro_id,
    l.isbn,
    l.titulo,
    l.anio_publicacion,
    l.precio,
    l.stock,
    f.nombre AS formato,
    ca.nombre AS categoria
FROM libro l
JOIN formato f
    ON f.formato_id = l.formato_id
JOIN categoria ca
    ON ca.categoria_id = l.categoria_id
WHERE l.libro_id = $1;


-- =========================================================
-- 14. IMAGEN DE PORTADA
-- =========================================================

SELECT
    imagen_id,
    libro_id,
    ruta_relativa,
    texto_alt
FROM imagen
WHERE libro_id = $1
AND es_portada = TRUE;


-- =========================================================
-- 15. CONTEO DE REGISTROS PARA VERIFICACIÓN
-- =========================================================

SELECT 'usuario' AS tabla, COUNT(*) AS registros FROM usuario
UNION ALL
SELECT 'formato', COUNT(*) FROM formato
UNION ALL
SELECT 'categoria', COUNT(*) FROM categoria
UNION ALL
SELECT 'libro', COUNT(*) FROM libro
UNION ALL
SELECT 'autor', COUNT(*) FROM autor
UNION ALL
SELECT 'libro_autor', COUNT(*) FROM libro_autor
UNION ALL
SELECT 'genero', COUNT(*) FROM genero
UNION ALL
SELECT 'libro_genero', COUNT(*) FROM libro_genero
UNION ALL
SELECT 'concepto', COUNT(*) FROM concepto
UNION ALL
SELECT 'libro_concepto', COUNT(*) FROM libro_concepto
UNION ALL
SELECT 'imagen', COUNT(*) FROM imagen
ORDER BY tabla;