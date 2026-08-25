// EJERCICIO GUIADO 02
// Rutas de autenticacion
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    registrarUsuario,
    buscarUsuarioPorEmail,
    verificarPassword
} = require('../services/authService');

const router = express.Router();


// =========================================================
// MOSTRAR LOGIN
// =========================================================

router.get('/login', (req, res) => {

    res.render('login', {
        mensaje: null
    });

});


// =========================================================
// PROCESAR LOGIN
// =========================================================

router.post('/login', async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {

            return res.status(400).render(
                'login',
                {
                    mensaje:
                        'Todos los campos son obligatorios.'
                }
            );

        }

        const usuario =
            await buscarUsuarioPorEmail(email);

        if (!usuario) {

            return res.status(401).render(
                'login',
                {
                    mensaje:
                        'Correo o contraseña incorrectos.'
                }
            );

        }

        if (!usuario.activo) {

            return res.status(403).render(
                'login',
                {
                    mensaje:
                        'La cuenta se encuentra inactiva.'
                }
            );

        }

        const passwordCorrecto =
            await verificarPassword(
                password,
                usuario.password_hash
            );

        if (!passwordCorrecto) {

            return res.status(401).render(
                'login',
                {
                    mensaje:
                        'Correo o contraseña incorrectos.'
                }
            );

        }

        req.session.usuario = {
            id: usuario.usuario_id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };

        res.redirect('/library/catalogo');

    } catch (error) {

        console.error(
            'Error al iniciar sesion:',
            error.message
        );

        res.status(500).render(
            'login',
            {
                mensaje:
                    'No fue posible iniciar sesión.'
            }
        );

    }

});


// =========================================================
// MOSTRAR REGISTRO
// =========================================================

router.get('/registro', (req, res) => {

    res.render('registro', {
        mensaje: null
    });

});


// =========================================================
// PROCESAR REGISTRO
// =========================================================

router.post('/registro', async (req, res) => {

    try {

        const {
            nombre,
            email,
            password
        } = req.body;

        if (!nombre || !email || !password) {

            return res.status(400).render(
                'registro',
                {
                    mensaje:
                        'Todos los campos son obligatorios.'
                }
            );

        }

        if (password.length < 6) {

            return res.status(400).render(
                'registro',
                {
                    mensaje:
                        'La contraseña debe tener al menos 6 caracteres.'
                }
            );

        }

        const usuarioExistente =
            await buscarUsuarioPorEmail(email);

        if (usuarioExistente) {

            return res.status(400).render(
                'registro',
                {
                    mensaje:
                        'El correo ya se encuentra registrado.'
                }
            );

        }

        await registrarUsuario(
            nombre,
            email,
            password
        );

        res.redirect('/library/login');

    } catch (error) {

        console.error(
            'Error al registrar usuario:',
            error.message
        );

        res.status(500).render(
            'registro',
            {
                mensaje:
                    'No fue posible registrar el usuario.'
            }
        );

    }

});


// =========================================================
// CERRAR SESION
// =========================================================

router.post('/logout', (req, res) => {

    req.session.destroy(() => {

        res.redirect('/library/login');

    });

});


module.exports = router;