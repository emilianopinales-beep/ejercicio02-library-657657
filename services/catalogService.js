// EJERCICIO GUIADO 02
// Servicio del catalogo de libros
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');

// Consultar catalogo completo
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


// Buscar libros por titulo o ISBN
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


module.exports = {
    obtenerCatalogo,
    buscarLibros
};