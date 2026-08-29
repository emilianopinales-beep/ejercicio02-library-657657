// EJERCICIO GUIADO 02
// Servicios del catalogo
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');


// =========================================================
// OBTENER CATALOGO
// =========================================================

async function obtenerCatalogo() {

    const consulta = `
        SELECT
            c.libro_id,
            c.isbn,
            c.titulo,
            c.anio_publicacion,
            c.precio,
            c.stock,
            c.formato,
            c.categoria,
            c.autores,
            c.generos,
            p.ruta_relativa AS portada,
            p.texto_alt AS portada_alt
        FROM vw_catalogo_libros c
        LEFT JOIN vw_portadas_libros p
            ON p.libro_id = c.libro_id
        ORDER BY c.titulo;
    `;

    const resultado = await pool.query(
        consulta
    );

    return resultado.rows;
}


// =========================================================
// BUSCAR LIBROS
// =========================================================

async function buscarLibros(busqueda) {

    const consulta = `
        SELECT
            c.libro_id,
            c.isbn,
            c.titulo,
            c.anio_publicacion,
            c.precio,
            c.stock,
            c.formato,
            c.categoria,
            c.autores,
            c.generos,
            p.ruta_relativa AS portada,
            p.texto_alt AS portada_alt
        FROM vw_catalogo_libros c
        LEFT JOIN vw_portadas_libros p
            ON p.libro_id = c.libro_id
        WHERE
            c.titulo ILIKE '%' || $1 || '%'
            OR c.isbn = $1
        ORDER BY c.titulo;
    `;

    const resultado = await pool.query(
        consulta,
        [busqueda]
    );

    return resultado.rows;
}


// =========================================================
// OBTENER DETALLE DE LIBRO
// =========================================================

async function obtenerDetalleLibro(libroId) {

    const consulta = `
        SELECT
            c.libro_id,
            c.isbn,
            c.titulo,
            c.anio_publicacion,
            c.precio,
            c.stock,
            c.formato,
            c.categoria,
            c.autores,
            c.generos,
            p.ruta_relativa AS portada,
            p.texto_alt AS portada_alt
        FROM vw_catalogo_libros c
        LEFT JOIN vw_portadas_libros p
            ON p.libro_id = c.libro_id
        WHERE c.libro_id = $1;
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
// OBTENER IMAGENES DEL LIBRO
// =========================================================

async function obtenerImagenesLibro(libroId) {

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
        FROM vw_libro_imagenes
        WHERE libro_id = $1
        ORDER BY
            es_portada DESC,
            imagen_id;
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
    obtenerConceptosLibro,
    obtenerImagenesLibro
};