// EJERCICIO GUIADO 02
// Servicios para el panel de administracion
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');


// =========================================================
// OBTENER LIBROS
// =========================================================

async function obtenerLibrosAdmin() {

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
        ORDER BY libro_id;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// OBTENER UN LIBRO POR ID
// =========================================================

async function obtenerLibroPorId(libroId) {

    const consulta = `
        SELECT
            libro_id,
            isbn,
            titulo,
            anio_publicacion,
            precio,
            stock,
            formato_id,
            categoria_id
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
// OBTENER FORMATOS
// =========================================================

async function obtenerFormatos() {

    const consulta = `
        SELECT
            formato_id,
            nombre
        FROM formato
        ORDER BY nombre;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// OBTENER CATEGORIAS
// =========================================================

async function obtenerCategorias() {

    const consulta = `
        SELECT
            categoria_id,
            nombre
        FROM categoria
        ORDER BY nombre;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// CREAR LIBRO
// =========================================================

async function crearLibro(datos) {

    const {
        isbn,
        titulo,
        anio_publicacion,
        precio,
        stock,
        formato_id,
        categoria_id
    } = datos;

    const consulta = `
        CALL sp_crear_libro(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        );
    `;

    await pool.query(
        consulta,
        [
            isbn,
            titulo,
            anio_publicacion,
            precio,
            stock,
            formato_id,
            categoria_id
        ]
    );
}


// =========================================================
// ACTUALIZAR LIBRO
// =========================================================

async function actualizarLibro(
    libroId,
    datos
) {

    const {
        isbn,
        titulo,
        anio_publicacion,
        precio,
        stock,
        formato_id,
        categoria_id
    } = datos;

    const consulta = `
        CALL sp_actualizar_libro(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
        );
    `;

    await pool.query(
        consulta,
        [
            libroId,
            isbn,
            titulo,
            anio_publicacion,
            precio,
            stock,
            formato_id,
            categoria_id
        ]
    );
}


// =========================================================
// ELIMINAR LIBRO
// =========================================================

async function eliminarLibro(libroId) {

    const consulta = `
        CALL sp_eliminar_libro($1);
    `;

    await pool.query(
        consulta,
        [libroId]
    );
}


module.exports = {
    obtenerLibrosAdmin,
    obtenerLibroPorId,
    obtenerFormatos,
    obtenerCategorias,
    crearLibro,
    actualizarLibro,
    eliminarLibro
};