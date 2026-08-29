// EJERCICIO GUIADO 02
// Servicios administrativos para catalogos
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');


// =========================================================
// CONFIGURACION DE CATALOGOS
// =========================================================

const catalogos = {

    formatos: {
        tabla: 'formato',
        id: 'formato_id'
    },

    categorias: {
        tabla: 'categoria',
        id: 'categoria_id'
    },

    generos: {
        tabla: 'genero',
        id: 'genero_id'
    },

    conceptos: {
        tabla: 'concepto',
        id: 'concepto_id'
    }

};


// =========================================================
// OBTENER CONFIGURACION
// =========================================================

function obtenerConfiguracion(tipo) {

    const configuracion = catalogos[tipo];

    if (!configuracion) {

        throw new Error(
            'Catalogo no valido.'
        );

    }

    return configuracion;
}


// =========================================================
// LISTAR REGISTROS
// =========================================================

async function obtenerRegistros(tipo) {

    const configuracion = obtenerConfiguracion(tipo);

    const consulta = `
        SELECT
            ${configuracion.id} AS id,
            nombre
        FROM ${configuracion.tabla}
        ORDER BY ${configuracion.id};
    `;

    const resultado = await pool.query(
        consulta
    );

    return resultado.rows;
}


// =========================================================
// OBTENER UN REGISTRO
// =========================================================

async function obtenerRegistroPorId(
    tipo,
    registroId
) {

    const configuracion = obtenerConfiguracion(tipo);

    const consulta = `
        SELECT
            ${configuracion.id} AS id,
            nombre
        FROM ${configuracion.tabla}
        WHERE ${configuracion.id} = $1;
    `;

    const resultado = await pool.query(
        consulta,
        [registroId]
    );

    return resultado.rows[0] || null;
}


// =========================================================
// CREAR REGISTRO
// =========================================================

async function crearRegistro(
    tipo,
    nombre
) {

    const configuracion = obtenerConfiguracion(tipo);

    const consulta = `
        INSERT INTO ${configuracion.tabla}
            (nombre)
        VALUES
            ($1);
    `;

    await pool.query(
        consulta,
        [nombre]
    );
}


// =========================================================
// ACTUALIZAR REGISTRO
// =========================================================

async function actualizarRegistro(
    tipo,
    registroId,
    nombre
) {

    const configuracion = obtenerConfiguracion(tipo);

    const consulta = `
        UPDATE ${configuracion.tabla}
        SET nombre = $1
        WHERE ${configuracion.id} = $2;
    `;

    await pool.query(
        consulta,
        [
            nombre,
            registroId
        ]
    );
}


// =========================================================
// ELIMINAR REGISTRO
// =========================================================

async function eliminarRegistro(
    tipo,
    registroId
) {

    const configuracion = obtenerConfiguracion(tipo);

    const consulta = `
        DELETE FROM ${configuracion.tabla}
        WHERE ${configuracion.id} = $1;
    `;

    await pool.query(
        consulta,
        [registroId]
    );
}


module.exports = {
    obtenerRegistros,
    obtenerRegistroPorId,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro
};