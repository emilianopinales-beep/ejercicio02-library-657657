// EJERCICIO GUIADO 02
// Aplicacion web monolitica - Libreria en linea
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const { requiereSesion } = require('./middleware/auth');

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';
const BASE_PATH = '/library';

// =========================================================
// CONFIGURACION DE EJS
// =========================================================

app.set('view engine', 'ejs');

app.set(
    'views',
    path.join(__dirname, 'views')
);

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
    BASE_PATH + '/public',
    express.static(
        path.join(__dirname, 'public')
    )
);

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            'sesion_desarrollo',

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            sameSite: 'lax'
        }
    })
);

// =========================================================
// PAGINA PRINCIPAL
// =========================================================

app.get(BASE_PATH, (req, res) => {

    res.render('inicio');

});

// =========================================================
// AUTENTICACION
// =========================================================

app.use(
    BASE_PATH,
    authRoutes
);

// =========================================================
// CATALOGO PROTEGIDO
// =========================================================

app.get(
    BASE_PATH + '/catalogo',
    requiereSesion,
    (req, res) => {

        res.render(
            'catalogo',
            {
                usuario:
                    req.session.usuario
            }
        );

    }
);

// =========================================================
// ERROR 404
// =========================================================

app.use((req, res) => {

    res.status(404).send(
        'Pagina no encontrada'
    );

});

// =========================================================
// INICIAR SERVIDOR
// =========================================================

app.listen(
    PORT,
    HOST,
    () => {

        console.log(
            `Aplicacion disponible en http://${HOST}:${PORT}${BASE_PATH}`
        );

    }
);