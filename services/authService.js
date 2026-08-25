// EJERCICIO GUIADO 02
// Servicio de autenticacion
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Registrar un usuario
async function registrarUsuario(nombre, email, password) {

    const passwordHash = await bcrypt.hash(password, 10);

    const consulta = `
        INSERT INTO usuario
        (nombre, email, password_hash, rol)
        VALUES ($1, $2, $3, 'usuario')
        RETURNING usuario_id, nombre, email, rol
    `;

    const valores = [
        nombre,
        email,
        passwordHash
    ];

    const resultado = await pool.query(
        consulta,
        valores
    );

    return resultado.rows[0];
}


// Buscar usuario por correo
async function buscarUsuarioPorEmail(email) {

    const consulta = `
        SELECT
            usuario_id,
            nombre,
            email,
            password_hash,
            rol,
            activo
        FROM usuario
        WHERE email = $1
    `;

    const resultado = await pool.query(
        consulta,
        [email]
    );

    return resultado.rows[0];
}


// Verificar contraseña
async function verificarPassword(
    password,
    passwordHash
) {

    return await bcrypt.compare(
        password,
        passwordHash
    );
}


module.exports = {
    registrarUsuario,
    buscarUsuarioPorEmail,
    verificarPassword
};