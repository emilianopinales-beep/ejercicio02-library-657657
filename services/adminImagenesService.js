// EJERCICIO GUIADO 02
// Servicios administrativos para imagenes
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');


// =========================================================
// OBTENER IMAGENES
// =========================================================

async function obtenerImagenes() {

    const consulta = `
        SELECT
            i.imagen_id,
            i.libro_id,
            l.titulo AS libro,
            i.nombre_archivo,
            i.ruta_relativa,
            i.mime_type,
            i.tamanio_bytes,
            i.es_portada,
            i.texto_alt
        FROM imagen i
        INNER JOIN libro l
            ON l.libro_id = i.libro_id
        ORDER BY i.imagen_id;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// OBTENER LIBROS
// =========================================================

async function obtenerLibrosParaImagen() {

    const consulta = `
        SELECT
            libro_id,
            titulo
        FROM libro
        ORDER BY titulo;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// OBTENER IMAGEN POR ID
// =========================================================

async function obtenerImagenPorId(imagenId) {

    const consulta = `
        SELECT
            imagen_id,
            libro_id,
            nombre_archivo,
            ruta_relativa,
            mime_type,
            tamanio_bytes,
            es_portada,
            texto_alt
        FROM imagen
        WHERE imagen_id = $1;
    `;

    const resultado = await pool.query(
        consulta,
        [imagenId]
    );

    return resultado.rows[0] || null;
}


// =========================================================
// CREAR IMAGEN
// =========================================================

async function crearImagen(datos) {

    const {
        libro_id,
        nombre_archivo,
        ruta_relativa,
        mime_type,
        tamanio_bytes,
        es_portada,
        texto_alt
    } = datos;

    const cliente = await pool.connect();

    try {

        await cliente.query('BEGIN');

        if (es_portada) {

            await cliente.query(
                `
                UPDATE imagen
                SET es_portada = FALSE
                WHERE libro_id = $1;
                `,
                [libro_id]
            );

        }

        await cliente.query(
            `
            INSERT INTO imagen (
                libro_id,
                nombre_archivo,
                ruta_relativa,
                mime_type,
                tamanio_bytes,
                es_portada,
                texto_alt
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            );
            `,
            [
                libro_id,
                nombre_archivo,
                ruta_relativa,
                mime_type,
                tamanio_bytes,
                es_portada,
                texto_alt || null
            ]
        );

        await cliente.query('COMMIT');

    } catch (error) {

        await cliente.query('ROLLBACK');

        throw error;

    } finally {

        cliente.release();

    }
}


// =========================================================
// ACTUALIZAR DATOS DE IMAGEN
// =========================================================

async function actualizarImagen(
    imagenId,
    datos
) {

    const {
        libro_id,
        es_portada,
        texto_alt
    } = datos;

    const cliente = await pool.connect();

    try {

        await cliente.query('BEGIN');

        if (es_portada) {

            await cliente.query(
                `
                UPDATE imagen
                SET es_portada = FALSE
                WHERE libro_id = $1
                  AND imagen_id <> $2;
                `,
                [
                    libro_id,
                    imagenId
                ]
            );

        }

        await cliente.query(
            `
            UPDATE imagen
            SET
                libro_id = $1,
                es_portada = $2,
                texto_alt = $3
            WHERE imagen_id = $4;
            `,
            [
                libro_id,
                es_portada,
                texto_alt || null,
                imagenId
            ]
        );

        await cliente.query('COMMIT');

    } catch (error) {

        await cliente.query('ROLLBACK');

        throw error;

    } finally {

        cliente.release();

    }
}


// =========================================================
// ELIMINAR REGISTRO DE IMAGEN
// =========================================================

async function eliminarImagen(imagenId) {

    const consulta = `
        DELETE FROM imagen
        WHERE imagen_id = $1;
    `;

    await pool.query(
        consulta,
        [imagenId]
    );
}


module.exports = {
    obtenerImagenes,
    obtenerLibrosParaImagen,
    obtenerImagenPorId,
    crearImagen,
    actualizarImagen,
    eliminarImagen
};