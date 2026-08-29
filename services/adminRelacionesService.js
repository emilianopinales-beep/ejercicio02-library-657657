// EJERCICIO GUIADO 02
// Servicios para relaciones de libros
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');


// =========================================================
// OBTENER LIBRO
// =========================================================

async function obtenerLibro(libroId) {

    const consulta = `
        SELECT
            libro_id,
            isbn,
            titulo
        FROM libro
        WHERE libro_id = $1;
    `;

    const resultado = await pool.query(
        consulta,
        [libroId]
    );

    return resultado.rows[0] || null;
}


// =========================================================
// AUTORES DISPONIBLES
// =========================================================

async function obtenerAutores() {

    const consulta = `
        SELECT
            autor_id,
            nombre,
            nacionalidad
        FROM autor
        ORDER BY nombre;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// AUTORES DEL LIBRO
// =========================================================

async function obtenerAutoresLibro(libroId) {

    const consulta = `
        SELECT
            a.autor_id,
            a.nombre,
            a.nacionalidad
        FROM libro_autor la
        INNER JOIN autor a
            ON a.autor_id = la.autor_id
        WHERE la.libro_id = $1
        ORDER BY a.nombre;
    `;

    const resultado = await pool.query(
        consulta,
        [libroId]
    );

    return resultado.rows;
}


// =========================================================
// ASOCIAR AUTOR
// =========================================================

async function asociarAutor(
    libroId,
    autorId
) {

    const consulta = `
        INSERT INTO libro_autor (
            libro_id,
            autor_id
        )
        VALUES (
            $1,
            $2
        )
        ON CONFLICT DO NOTHING;
    `;

    await pool.query(
        consulta,
        [
            libroId,
            autorId
        ]
    );
}


// =========================================================
// ELIMINAR AUTOR DEL LIBRO
// =========================================================

async function eliminarAutor(
    libroId,
    autorId
) {

    const consulta = `
        DELETE FROM libro_autor
        WHERE libro_id = $1
          AND autor_id = $2;
    `;

    await pool.query(
        consulta,
        [
            libroId,
            autorId
        ]
    );
}


// =========================================================
// GENEROS DISPONIBLES
// =========================================================

async function obtenerGeneros() {

    const consulta = `
        SELECT
            genero_id,
            nombre
        FROM genero
        ORDER BY nombre;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// GENEROS DEL LIBRO
// =========================================================

async function obtenerGenerosLibro(libroId) {

    const consulta = `
        SELECT
            g.genero_id,
            g.nombre
        FROM libro_genero lg
        INNER JOIN genero g
            ON g.genero_id = lg.genero_id
        WHERE lg.libro_id = $1
        ORDER BY g.nombre;
    `;

    const resultado = await pool.query(
        consulta,
        [libroId]
    );

    return resultado.rows;
}


// =========================================================
// ASOCIAR GENERO
// =========================================================

async function asociarGenero(
    libroId,
    generoId
) {

    const consulta = `
        INSERT INTO libro_genero (
            libro_id,
            genero_id
        )
        VALUES (
            $1,
            $2
        )
        ON CONFLICT DO NOTHING;
    `;

    await pool.query(
        consulta,
        [
            libroId,
            generoId
        ]
    );
}


// =========================================================
// ELIMINAR GENERO DEL LIBRO
// =========================================================

async function eliminarGenero(
    libroId,
    generoId
) {

    const consulta = `
        DELETE FROM libro_genero
        WHERE libro_id = $1
          AND genero_id = $2;
    `;

    await pool.query(
        consulta,
        [
            libroId,
            generoId
        ]
    );
}


// =========================================================
// CONCEPTOS DISPONIBLES
// =========================================================

async function obtenerConceptos() {

    const consulta = `
        SELECT
            concepto_id,
            nombre
        FROM concepto
        ORDER BY nombre;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// CONCEPTOS DEL LIBRO
// =========================================================

async function obtenerConceptosLibro(libroId) {

    const consulta = `
        SELECT
            c.concepto_id,
            c.nombre,
            lc.definicion,
            lc.referencia
        FROM libro_concepto lc
        INNER JOIN concepto c
            ON c.concepto_id = lc.concepto_id
        WHERE lc.libro_id = $1
        ORDER BY c.nombre;
    `;

    const resultado = await pool.query(
        consulta,
        [libroId]
    );

    return resultado.rows;
}


// =========================================================
// CREAR O ACTUALIZAR CONCEPTO DEL LIBRO
// =========================================================

async function guardarConcepto(
    libroId,
    conceptoId,
    definicion,
    referencia
) {

    const consulta = `
        INSERT INTO libro_concepto (
            libro_id,
            concepto_id,
            definicion,
            referencia
        )
        VALUES (
            $1,
            $2,
            $3,
            $4
        )
        ON CONFLICT (libro_id, concepto_id)
        DO UPDATE SET
            definicion = EXCLUDED.definicion,
            referencia = EXCLUDED.referencia;
    `;

    await pool.query(
        consulta,
        [
            libroId,
            conceptoId,
            definicion,
            referencia || null
        ]
    );
}


// =========================================================
// ELIMINAR CONCEPTO DEL LIBRO
// =========================================================

async function eliminarConcepto(
    libroId,
    conceptoId
) {

    const consulta = `
        DELETE FROM libro_concepto
        WHERE libro_id = $1
          AND concepto_id = $2;
    `;

    await pool.query(
        consulta,
        [
            libroId,
            conceptoId
        ]
    );
}


module.exports = {
    obtenerLibro,

    obtenerAutores,
    obtenerAutoresLibro,
    asociarAutor,
    eliminarAutor,

    obtenerGeneros,
    obtenerGenerosLibro,
    asociarGenero,
    eliminarGenero,

    obtenerConceptos,
    obtenerConceptosLibro,
    guardarConcepto,
    eliminarConcepto
};