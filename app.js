// EJERCICIO GUIADO 02
// Aplicacion web monolitica de biblioteca
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminCatalogosRoutes = require('./routes/adminCatalogosRoutes');
const adminAutoresRoutes = require('./routes/adminAutoresRoutes');
const adminUsuariosRoutes = require('./routes/adminUsuariosRoutes');
const adminImagenesRoutes = require('./routes/adminImagenesRoutes');
const adminRelacionesRoutes = require('./routes/adminRelacionesRoutes');

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
        extended: true
    })
);


// Archivos publicos: CSS, imagenes, etc.
app.use(
    BASE_PATH,
    express.static(
        path.join(__dirname, 'public')
    )
);


// Imagenes subidas por el administrador
app.use(
    BASE_PATH + '/uploads',
    express.static(
        path.join(__dirname, 'uploads')
    )
);


// =========================================================
// SESIONES
// =========================================================

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'session_library',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true
        }
    })
);


// =========================================================
// PAGINA PRINCIPAL
// =========================================================

app.get(
    BASE_PATH,
    (req, res) => {

        res.render(
            'inicio',
            {
                usuario: req.session.usuario || null
            }
        );

    }
);


// =========================================================
// RUTAS
// =========================================================

app.use(
    BASE_PATH,
    authRoutes
);

app.use(
    BASE_PATH,
    catalogRoutes
);

app.use(
    BASE_PATH,
    adminRoutes
);

app.use(
    BASE_PATH,
    adminCatalogosRoutes
);

app.use(
    BASE_PATH,
    adminAutoresRoutes
);

app.use(
    BASE_PATH,
    adminUsuariosRoutes
);

app.use(
    BASE_PATH,
    adminImagenesRoutes
);

app.use(
    BASE_PATH,
    adminRelacionesRoutes
);


// =========================================================
// RUTA NO ENCONTRADA
// =========================================================

app.use(
    (req, res) => {

        res.status(404).send(
            'Pagina no encontrada.'
        );

    }
);


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