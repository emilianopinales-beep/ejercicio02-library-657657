// EJERCICIO GUIADO 02
// Servicio del catalogo de libros
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');


// =========================================================
// CONSULTAR CATALOGO COMPLETO
// =========================================================

async function obtenerCatalogo() {

    const consulta = `
        SELECT
            libro_id,
            isbn,
            titulo,
            anio_publicacion,
            precio,
            stock,
            formato,
            categoria,
            autores,
            generos
        FROM vw_catalogo_libros
        ORDER BY titulo
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// BUSCAR POR TITULO O ISBN
// =========================================================

async function buscarLibros(busqueda) {

    const consulta = `
        SELECT
            libro_id,
            isbn,
            titulo,
            anio_publicacion,
            precio,
            stock,
            formato,
            categoria,
            autores,
            generos
        FROM vw_catalogo_libros
        WHERE titulo ILIKE '%' || $1 || '%'
           OR isbn = $1
        ORDER BY titulo
    `;

    const resultado = await pool.query(
        consulta,
        [busqueda]
    );

    return resultado.rows;
}


// =========================================================
// OBTENER DETALLE DE UN LIBRO
// =========================================================

async function obtenerDetalleLibro(libroId) {

    const consulta = `
        SELECT
            libro_id,
            isbn,
            titulo,
            anio_publicacion,
            precio,
            stock,
            formato,
            categoria,
            autores,
            generos
        FROM vw_catalogo_libros
        WHERE libro_id = $1
    `;

    const resultado = await pool.query(
        consulta,
        [libroId]
    );

    return resultado.rows[0] || null;
}


// =========================================================
// OBTENER CONCEPTOS DEL LIBRO
// =========================================================

async function obtenerConceptosLibro(libroId) {

    const consulta = `
        SELECT
            c.concepto_id,
            c.nombre,
            lc.definicion
        FROM libro_concepto lc
        INNER JOIN concepto c
            ON c.concepto_id = lc.concepto_id
        WHERE lc.libro_id = $1
        ORDER BY c.nombre
    `;

    const resultado = await pool.query(
        consulta,
        [libroId]
    );

    return resultado.rows;
}


module.exports = {
    obtenerCatalogo,
    buscarLibros,
    obtenerDetalleLibro,
    obtenerConceptosLibro
};