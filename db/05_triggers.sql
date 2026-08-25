-- EJERCICIO GUIADO 02
-- Triggers de integridad
-- Alumno: Emiliano Pascual Pinales Sanchez
-- Matrícula: 657657
--
-- Ejecutar después de 01_schema.sql.
-- Estos triggers agregan una segunda defensa en PostgreSQL
-- para reglas críticas del sistema.

-- =========================================================
-- 1. IMPEDIR MÁS DE UN ADMINISTRADOR
-- =========================================================

CREATE OR REPLACE FUNCTION fn_validar_un_solo_administrador()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.rol = 'administrador' THEN

        IF EXISTS (
            SELECT 1
            FROM usuario
            WHERE rol = 'administrador'
              AND usuario_id <> COALESCE(NEW.usuario_id, -1)
        ) THEN

            RAISE EXCEPTION
                'Solo puede existir un administrador en el sistema';

        END IF;

    END IF;

    RETURN NEW;

END;
$$;


CREATE TRIGGER trg_validar_un_solo_administrador
BEFORE INSERT OR UPDATE OF rol
ON usuario
FOR EACH ROW
EXECUTE FUNCTION fn_validar_un_solo_administrador();


-- =========================================================
-- 2. IMPEDIR MÁS DE UNA PORTADA POR LIBRO
-- =========================================================

CREATE OR REPLACE FUNCTION fn_validar_una_portada_por_libro()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF NEW.es_portada = TRUE THEN

        IF EXISTS (
            SELECT 1
            FROM imagen
            WHERE libro_id = NEW.libro_id
              AND es_portada = TRUE
              AND imagen_id <> COALESCE(NEW.imagen_id, -1)
        ) THEN

            RAISE EXCEPTION
                'El libro ya tiene una imagen marcada como portada';

        END IF;

    END IF;

    RETURN NEW;

END;
$$;


CREATE TRIGGER trg_validar_una_portada_por_libro
BEFORE INSERT OR UPDATE OF es_portada, libro_id
ON imagen
FOR EACH ROW
EXECUTE FUNCTION fn_validar_una_portada_por_libro();


-- =========================================================
-- CONSULTAS DE VERIFICACIÓN
-- =========================================================

-- Ver funciones creadas:
-- \df fn_validar_un_solo_administrador
-- \df fn_validar_una_portada_por_libro

-- Ver triggers:
-- SELECT
--     trigger_name,
--     event_object_table,
--     action_timing,
--     event_manipulation
-- FROM information_schema.triggers
-- ORDER BY event_object_table, trigger_name;


-- =========================================================
-- PRUEBAS NEGATIVAS
-- EJECUTAR DESPUÉS DE CARGAR LOS DATOS
-- =========================================================

-- Debe fallar porque ya existe un administrador:
--
-- INSERT INTO usuario
-- (nombre, email, password_hash, rol)
-- VALUES
-- (
--     'Administrador 2',
--     'admin2@example.com',
--     'HASH_DEMO',
--     'administrador'
-- );


-- Debe fallar si el libro 1 ya tiene una portada:
--
-- INSERT INTO imagen
-- (
--     libro_id,
--     nombre_archivo,
--     ruta_relativa,
--     mime_type,
--     tamanio_bytes,
--     es_portada,
--     texto_alt
-- )
-- VALUES
-- (
--     1,
--     'segunda_portada.jpg',
--     '/uploads/segunda_portada.jpg',
--     'image/jpeg',
--     150000,
--     TRUE,
--     'Segunda portada de prueba'
-- );