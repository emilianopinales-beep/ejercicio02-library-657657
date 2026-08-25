-- EJERCICIO GUIADO 02
-- Datos sintéticos: 30 registros por tabla
-- Alumno: Emiliano Pascual Pinales Sanchez
-- Matrícula: 657657
--
-- Ejecutar después de 01_schema.sql.
-- Diseñado para ejecutarse una sola vez sobre las tablas vacías.
-- Los password_hash incluidos son datos sintéticos de prueba,
-- no representan contraseñas reales.

BEGIN;

-- =========================================================
-- 1. USUARIO - 30 registros
-- =========================================================

INSERT INTO usuario
(nombre, email, password_hash, rol, activo)
SELECT
    'Usuario ' || LPAD(n::TEXT, 2, '0'),
    'usuario' || LPAD(n::TEXT, 2, '0') || '@example.com',
    'HASH_DEMO_' || LPAD(n::TEXT, 2, '0'),
    CASE
        WHEN n = 1 THEN 'administrador'
        ELSE 'usuario'
    END,
    TRUE
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 2. FORMATO - 30 registros
-- =========================================================

INSERT INTO formato (nombre)
SELECT
    'Formato ' || LPAD(n::TEXT, 2, '0')
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 3. CATEGORIA - 30 registros
-- =========================================================

INSERT INTO categoria (nombre)
SELECT
    'Categoria ' || LPAD(n::TEXT, 2, '0')
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 4. LIBRO - 30 registros
-- =========================================================

INSERT INTO libro
(isbn, titulo, anio_publicacion, precio, stock, formato_id, categoria_id)
SELECT
    '978000000' || LPAD(n::TEXT, 4, '0'),
    'Libro de prueba ' || LPAD(n::TEXT, 2, '0'),
    1990 + n,
    100.00 + (n * 15.00),
    n,
    n,
    n
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 5. AUTOR - 30 registros
-- =========================================================

INSERT INTO autor
(nombre, nacionalidad)
SELECT
    'Autor ' || LPAD(n::TEXT, 2, '0'),
    'Nacionalidad ' || LPAD((((n - 1) % 10) + 1)::TEXT, 2, '0')
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 6. LIBRO_AUTOR - 30 registros
-- Algunos libros tienen más de un autor.
-- Algunos autores participan en más de un libro.
-- =========================================================

INSERT INTO libro_autor
(libro_id, autor_id)
SELECT
    ((n - 1) / 2) + 1,
    ((n - 1) % 15) + 1
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 7. GENERO - 30 registros
-- =========================================================

INSERT INTO genero (nombre)
SELECT
    'Genero ' || LPAD(n::TEXT, 2, '0')
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 8. LIBRO_GENERO - 30 registros
-- Se demuestra la relación muchos a muchos.
-- =========================================================

INSERT INTO libro_genero
(libro_id, genero_id)
SELECT
    ((n - 1) / 2) + 1,
    ((n - 1) % 10) + 1
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 9. CONCEPTO - 30 registros
-- =========================================================

INSERT INTO concepto (nombre)
SELECT
    CASE n
        WHEN 1 THEN 'IaaS'
        WHEN 2 THEN 'PaaS'
        WHEN 3 THEN 'SaaS'
        WHEN 4 THEN 'FaaS'
        WHEN 5 THEN 'Bucket'
        WHEN 6 THEN 'Public Cloud'
        WHEN 7 THEN 'Private Cloud'
        WHEN 8 THEN 'Hybrid Cloud'
        WHEN 9 THEN 'Multicloud'
        WHEN 10 THEN 'Serverless'
        ELSE 'Concepto ' || LPAD(n::TEXT, 2, '0')
    END
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 10. LIBRO_CONCEPTO - 30 registros
-- Cada uno de los primeros 10 libros recibe 3 conceptos.
-- La definición pertenece a libro + concepto.
-- =========================================================

INSERT INTO libro_concepto
(libro_id, concepto_id, definicion, referencia)
SELECT
    ((n - 1) / 3) + 1,
    ((n - 1) % 10) + 1,
    'Definicion sintetica del concepto '
        || (((n - 1) % 10) + 1)
        || ' para el libro '
        || (((n - 1) / 3) + 1),
    'Capitulo ' || (((n - 1) % 5) + 1)
FROM generate_series(1, 30) AS n;


-- =========================================================
-- 11. IMAGEN - 30 registros
-- Los primeros 15 libros reciben dos imágenes.
-- Solamente una imagen por libro se marca como portada.
-- =========================================================

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
SELECT
    ((n - 1) / 2) + 1,

    CASE
        WHEN n % 3 = 1 THEN
            'imagen_' || LPAD(n::TEXT, 2, '0') || '.jpg'
        WHEN n % 3 = 2 THEN
            'imagen_' || LPAD(n::TEXT, 2, '0') || '.png'
        ELSE
            'imagen_' || LPAD(n::TEXT, 2, '0') || '.webp'
    END,

    CASE
        WHEN n % 3 = 1 THEN
            '/uploads/imagen_' || LPAD(n::TEXT, 2, '0') || '.jpg'
        WHEN n % 3 = 2 THEN
            '/uploads/imagen_' || LPAD(n::TEXT, 2, '0') || '.png'
        ELSE
            '/uploads/imagen_' || LPAD(n::TEXT, 2, '0') || '.webp'
    END,

    CASE
        WHEN n % 3 = 1 THEN 'image/jpeg'
        WHEN n % 3 = 2 THEN 'image/png'
        ELSE 'image/webp'
    END,

    100000 + (n * 1000),

    CASE
        WHEN n % 2 = 1 THEN TRUE
        ELSE FALSE
    END,

    'Imagen del libro ' || (((n - 1) / 2) + 1)

FROM generate_series(1, 30) AS n;


COMMIT;


-- =========================================================
-- VERIFICACIÓN
-- Cada tabla debe mostrar exactamente 30 registros.
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