// EJERCICIO GUIADO 02
// Servicios administrativos para autores
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');


// =========================================================
// OBTENER AUTORES
// =========================================================

async function obtenerAutores() {

    const consulta = `
        SELECT
            autor_id,
            nombre,
            nacionalidad
        FROM autor
        ORDER BY autor_id;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// OBTENER AUTOR POR ID
// =========================================================

async function obtenerAutorPorId(autorId) {

    const consulta = `
        SELECT
            autor_id,
            nombre,
            nacionalidad
        FROM autor
        WHERE autor_id = $1;
    `;

    const resultado = await pool.query(
        consulta,
        [autorId]
    );

    return resultado.rows[0] || null;
}


// =========================================================
// CREAR AUTOR
// =========================================================

async function crearAutor(datos) {

    const {
        nombre,
        nacionalidad
    } = datos;

    const consulta = `
        INSERT INTO autor (
            nombre,
            nacionalidad
        )
        VALUES (
            $1,
            $2
        );
    `;

    await pool.query(
        consulta,
        [
            nombre,
            nacionalidad || null
        ]
    );
}


// =========================================================
// ACTUALIZAR AUTOR
// =========================================================

async function actualizarAutor(
    autorId,
    datos
) {

    const {
        nombre,
        nacionalidad
    } = datos;

    const consulta = `
        UPDATE autor
        SET
            nombre = $1,
            nacionalidad = $2
        WHERE autor_id = $3;
    `;

    await pool.query(
        consulta,
        [
            nombre,
            nacionalidad || null,
            autorId
        ]
    );
}


// =========================================================
// ELIMINAR AUTOR
// =========================================================

async function eliminarAutor(autorId) {

    const consulta = `
        DELETE FROM autor
        WHERE autor_id = $1;
    `;

    await pool.query(
        consulta,
        [autorId]
    );
}


module.exports = {
    obtenerAutores,
    obtenerAutorPorId,
    crearAutor,
    actualizarAutor,
    eliminarAutor
};