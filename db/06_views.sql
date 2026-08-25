-- EJERCICIO GUIADO 02
-- Vistas de la base de datos
-- Alumno: Emiliano Pascual Pinales Sanchez
-- Matrícula: 657657
--
-- Ejecutar después de:
-- 01_schema.sql
-- 02_seed_30_per_table.sql

-- =========================================================
-- 1. VISTA GENERAL DEL CATÁLOGO
-- =========================================================

CREATE OR REPLACE VIEW vw_catalogo_libros AS
SELECT
    l.libro_id,
    l.isbn,
    l.titulo,
    l.anio_publicacion,
    l.precio,
    l.stock,
    f.nombre AS formato,
    c.nombre AS categoria,

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

JOIN categoria c
    ON c.categoria_id = l.categoria_id

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
    c.nombre;


-- =========================================================
-- 2. VISTA DE CONCEPTOS Y DEFINICIONES POR LIBRO
-- =========================================================

CREATE OR REPLACE VIEW vw_libro_conceptos AS
SELECT
    l.libro_id,
    l.isbn,
    l.titulo,
    c.concepto_id,
    c.nombre AS concepto,
    lc.definicion,
    lc.referencia

FROM libro_concepto lc

JOIN libro l
    ON l.libro_id = lc.libro_id

JOIN concepto c
    ON c.concepto_id = lc.concepto_id;


-- =========================================================
-- 3. VISTA DE IMÁGENES DE LIBROS
-- =========================================================

CREATE OR REPLACE VIEW vw_libro_imagenes AS
SELECT
    i.imagen_id,
    i.libro_id,
    l.isbn,
    l.titulo,
    i.nombre_archivo,
    i.ruta_relativa,
    i.mime_type,
    i.tamanio_bytes,
    i.es_portada,
    i.texto_alt

FROM imagen i

JOIN libro l
    ON l.libro_id = i.libro_id;


-- =========================================================
-- 4. VISTA DE PORTADAS
-- =========================================================

CREATE OR REPLACE VIEW vw_portadas_libros AS
SELECT
    l.libro_id,
    l.isbn,
    l.titulo,
    i.imagen_id,
    i.ruta_relativa,
    i.texto_alt

FROM libro l

LEFT JOIN imagen i
    ON i.libro_id = l.libro_id
   AND i.es_portada = TRUE;


-- =========================================================
-- CONSULTAS DE VERIFICACIÓN
-- =========================================================

-- SELECT * FROM vw_catalogo_libros;
-- SELECT * FROM vw_libro_conceptos;
-- SELECT * FROM vw_libro_imagenes;
-- SELECT * FROM vw_portadas_libros;

-- Ver todas las vistas creadas:
--
-- SELECT table_name
-- FROM information_schema.views
-- WHERE table_schema = 'public'
-- ORDER BY table_name;