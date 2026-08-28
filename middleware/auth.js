// EJERCICIO GUIADO 02
// Middleware de autenticacion y autorizacion
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657


// =========================================================
// REQUIERE SESION
// =========================================================

function requiereSesion(req, res, next) {

    if (!req.session || !req.session.usuario) {

        return res.redirect('/library/login');

    }

    next();
}


// =========================================================
// REQUIERE ADMINISTRADOR
// =========================================================

function requiereAdmin(req, res, next) {

    if (!req.session || !req.session.usuario) {

        return res.redirect('/library/login');

    }

    if (req.session.usuario.rol !== 'administrador') {

        return res.status(403).send(
            'Acceso denegado. Solo el administrador puede ingresar.'
        );

    }

    next();
}


module.exports = {
    requiereSesion,
    requiereAdmin
};