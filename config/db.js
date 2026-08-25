// EJERCICIO GUIADO 02
// Conexion directa a PostgreSQL

require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Manejo de errores inesperados de PostgreSQL
pool.on('error', (error) => {
    console.error('Error inesperado en PostgreSQL:', error.message);
});

module.exports = pool;