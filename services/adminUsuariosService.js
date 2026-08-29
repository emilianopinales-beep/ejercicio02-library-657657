// EJERCICIO GUIADO 02
// Servicios administrativos para usuarios
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const pool = require('../config/db');
const bcrypt = require('bcryptjs');


// =========================================================
// OBTENER USUARIOS
// =========================================================

async function obtenerUsuarios() {

    const consulta = `
        SELECT
            usuario_id,
            nombre,
            email,
            rol,
            activo,
            fecha_registro
        FROM usuario
        ORDER BY usuario_id;
    `;

    const resultado = await pool.query(consulta);

    return resultado.rows;
}


// =========================================================
// OBTENER USUARIO POR ID
// =========================================================

async function obtenerUsuarioPorId(usuarioId) {

    const consulta = `
        SELECT
            usuario_id,
            nombre,
            email,
            rol,
            activo,
            fecha_registro
        FROM usuario
        WHERE usuario_id = $1;
    `;

    const resultado = await pool.query(
        consulta,
        [usuarioId]
    );

    return resultado.rows[0] || null;
}


// =========================================================
// CREAR USUARIO
// =========================================================

async function crearUsuario(datos) {

    const {
        nombre,
        email,
        password,
        rol,
        activo
    } = datos;

    const passwordHash = await bcrypt.hash(
        password,
        10
    );

    const consulta = `
        INSERT INTO usuario (
            nombre,
            email,
            password_hash,
            rol,
            activo
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5
        );
    `;

    await pool.query(
        consulta,
        [
            nombre,
            email,
            passwordHash,
            rol,
            activo
        ]
    );
}


// =========================================================
// ACTUALIZAR USUARIO
// =========================================================

async function actualizarUsuario(
    usuarioId,
    datos
) {

    const {
        nombre,
        email,
        password,
        rol,
        activo
    } = datos;

    if (password) {

        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        const consulta = `
            UPDATE usuario
            SET
                nombre = $1,
                email = $2,
                password_hash = $3,
                rol = $4,
                activo = $5
            WHERE usuario_id = $6;
        `;

        await pool.query(
            consulta,
            [
                nombre,
                email,
                passwordHash,
                rol,
                activo,
                usuarioId
            ]
        );

    } else {

        const consulta = `
            UPDATE usuario
            SET
                nombre = $1,
                email = $2,
                rol = $3,
                activo = $4
            WHERE usuario_id = $5;
        `;

        await pool.query(
            consulta,
            [
                nombre,
                email,
                rol,
                activo,
                usuarioId
            ]
        );

    }
}


// =========================================================
// ELIMINAR USUARIO
// =========================================================

async function eliminarUsuario(usuarioId) {

    const consulta = `
        DELETE FROM usuario
        WHERE usuario_id = $1;
    `;

    await pool.query(
        consulta,
        [usuarioId]
    );
}


module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};