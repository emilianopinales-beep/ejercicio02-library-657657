-- EJERCICIO GUIADO 02
-- Procedimientos almacenados
-- Alumno: Emiliano Pascual Pinales Sanchez
-- Matrícula: 657657
--
-- Ejecutar después de:
-- 01_schema.sql
-- 02_seed_30_per_table.sql
--
-- Estos procedimientos concentran operaciones importantes
-- de escritura sobre la base de datos.

-- =========================================================
-- 1. CREAR LIBRO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_crear_libro(
    IN p_isbn VARCHAR(20),
    IN p_titulo VARCHAR(200),
    IN p_anio_publicacion INTEGER,
    IN p_precio NUMERIC(10,2),
    IN p_stock INTEGER,
    IN p_formato_id INTEGER,
    IN p_categoria_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO libro (
        isbn,
        titulo,
        anio_publicacion,
        precio,
        stock,
        formato_id,
        categoria_id
    )
    VALUES (
        p_isbn,
        p_titulo,
        p_anio_publicacion,
        p_precio,
        p_stock,
        p_formato_id,
        p_categoria_id
    );

END;
$$;


-- =========================================================
-- 2. ACTUALIZAR LIBRO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_actualizar_libro(
    IN p_libro_id INTEGER,
    IN p_isbn VARCHAR(20),
    IN p_titulo VARCHAR(200),
    IN p_anio_publicacion INTEGER,
    IN p_precio NUMERIC(10,2),
    IN p_stock INTEGER,
    IN p_formato_id INTEGER,
    IN p_categoria_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE libro
    SET
        isbn = p_isbn,
        titulo = p_titulo,
        anio_publicacion = p_anio_publicacion,
        precio = p_precio,
        stock = p_stock,
        formato_id = p_formato_id,
        categoria_id = p_categoria_id
    WHERE libro_id = p_libro_id;

END;
$$;


-- =========================================================
-- 3. ELIMINAR LIBRO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_eliminar_libro(
    IN p_libro_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    DELETE FROM libro
    WHERE libro_id = p_libro_id;

END;
$$;


-- =========================================================
-- 4. ACTUALIZAR STOCK
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_actualizar_stock(
    IN p_libro_id INTEGER,
    IN p_stock INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE libro
    SET stock = p_stock
    WHERE libro_id = p_libro_id;

END;
$$;


-- =========================================================
-- 5. ACTUALIZAR PRECIO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_actualizar_precio(
    IN p_libro_id INTEGER,
    IN p_precio NUMERIC(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE libro
    SET precio = p_precio
    WHERE libro_id = p_libro_id;

END;
$$;


-- =========================================================
-- 6. ASOCIAR AUTOR A LIBRO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_asociar_autor_libro(
    IN p_libro_id INTEGER,
    IN p_autor_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO libro_autor (
        libro_id,
        autor_id
    )
    VALUES (
        p_libro_id,
        p_autor_id
    );

END;
$$;


-- =========================================================
-- 7. ASOCIAR GÉNERO A LIBRO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_asociar_genero_libro(
    IN p_libro_id INTEGER,
    IN p_genero_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO libro_genero (
        libro_id,
        genero_id
    )
    VALUES (
        p_libro_id,
        p_genero_id
    );

END;
$$;


-- =========================================================
-- 8. ASOCIAR CONCEPTO A LIBRO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_asociar_concepto_libro(
    IN p_libro_id INTEGER,
    IN p_concepto_id INTEGER,
    IN p_definicion TEXT,
    IN p_referencia VARCHAR(150)
)
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO libro_concepto (
        libro_id,
        concepto_id,
        definicion,
        referencia
    )
    VALUES (
        p_libro_id,
        p_concepto_id,
        p_definicion,
        p_referencia
    );

END;
$$;


-- =========================================================
-- 9. ACTUALIZAR DEFINICIÓN DE CONCEPTO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_actualizar_concepto_libro(
    IN p_libro_id INTEGER,
    IN p_concepto_id INTEGER,
    IN p_definicion TEXT,
    IN p_referencia VARCHAR(150)
)
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE libro_concepto
    SET
        definicion = p_definicion,
        referencia = p_referencia
    WHERE libro_id = p_libro_id
      AND concepto_id = p_concepto_id;

END;
$$;


-- =========================================================
-- 10. ELIMINAR CONCEPTO DE LIBRO
-- =========================================================

CREATE OR REPLACE PROCEDURE sp_eliminar_concepto_libro(
    IN p_libro_id INTEGER,
    IN p_concepto_id INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN

    DELETE FROM libro_concepto
    WHERE libro_id = p_libro_id
      AND concepto_id = p_concepto_id;

END;
$$;


-- =========================================================
-- EJEMPLOS DE USO
-- NO EJECUTAR COMO PARTE DE LA CARGA NORMAL
-- =========================================================

-- CALL sp_actualizar_stock(1, 20);

-- CALL sp_actualizar_precio(1, 450.00);

-- CALL sp_asociar_autor_libro(1, 2);

-- CALL sp_asociar_genero_libro(1, 3);

-- CALL sp_asociar_concepto_libro(
--     1,
--     1,
--     'Definición de ejemplo',
--     'Capítulo 1'
-- );