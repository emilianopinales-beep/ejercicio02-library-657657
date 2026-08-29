// EJERCICIO GUIADO 02
// Rutas administrativas para usuarios
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    requiereAdmin
} = require('../middleware/auth');

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../services/adminUsuariosService');

const router = express.Router();


// =========================================================
// LISTAR USUARIOS
// =========================================================

router.get(
    '/admin/usuarios',
    requiereAdmin,
    async (req, res) => {

        try {

            const usuarios = await obtenerUsuarios();

            res.render(
                'adminUsuarios',
                {
                    usuario: req.session.usuario,
                    usuarios
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener usuarios:',
                error
            );

            res.status(500).send(
                'Error al obtener los usuarios.'
            );

        }

    }
);


// =========================================================
// FORMULARIO NUEVO USUARIO
// =========================================================

router.get(
    '/admin/usuarios/nuevo',
    requiereAdmin,
    (req, res) => {

        res.render(
            'adminUsuarioFormulario',
            {
                usuario: req.session.usuario,
                usuarioEditar: null
            }
        );

    }
);


// =========================================================
// CREAR USUARIO
// =========================================================

router.post(
    '/admin/usuarios/nuevo',
    requiereAdmin,
    async (req, res) => {

        try {

            const nombre = req.body.nombre.trim();
            const email = req.body.email.trim();
            const password = req.body.password;
            const rol = req.body.rol;
            const activo = req.body.activo === 'on';

            if (!nombre || !email || !password) {

                return res.status(400).send(
                    'Nombre, correo y contraseña son obligatorios.'
                );

            }

            if (
                rol !== 'usuario' &&
                rol !== 'administrador'
            ) {

                return res.status(400).send(
                    'Rol no válido.'
                );

            }

            await crearUsuario({
                nombre,
                email,
                password,
                rol,
                activo
            });

            res.redirect(
                '/library/admin/usuarios'
            );

        } catch (error) {

            console.error(
                'Error al crear usuario:',
                error
            );

            res.status(500).send(
                'No fue posible crear el usuario. Verifica que el correo no exista y que no se intente crear un segundo administrador.'
            );

        }

    }
);


// =========================================================
// FORMULARIO EDITAR USUARIO
// =========================================================

router.get(
    '/admin/usuarios/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const usuarioId = Number(
                req.params.id
            );

            const usuarioEditar =
                await obtenerUsuarioPorId(
                    usuarioId
                );

            if (!usuarioEditar) {

                return res.status(404).send(
                    'Usuario no encontrado.'
                );

            }

            res.render(
                'adminUsuarioFormulario',
                {
                    usuario: req.session.usuario,
                    usuarioEditar
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener usuario:',
                error
            );

            res.status(500).send(
                'Error al obtener el usuario.'
            );

        }

    }
);


// =========================================================
// ACTUALIZAR USUARIO
// =========================================================

router.post(
    '/admin/usuarios/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const usuarioId = Number(
                req.params.id
            );

            const nombre = req.body.nombre.trim();
            const email = req.body.email.trim();
            const password = req.body.password;
            const rol = req.body.rol;
            const activo = req.body.activo === 'on';

            if (!nombre || !email) {

                return res.status(400).send(
                    'Nombre y correo son obligatorios.'
                );

            }

            if (
                rol !== 'usuario' &&
                rol !== 'administrador'
            ) {

                return res.status(400).send(
                    'Rol no válido.'
                );

            }

            await actualizarUsuario(
                usuarioId,
                {
                    nombre,
                    email,
                    password,
                    rol,
                    activo
                }
            );

            res.redirect(
                '/library/admin/usuarios'
            );

        } catch (error) {

            console.error(
                'Error al actualizar usuario:',
                error
            );

            res.status(500).send(
                'No fue posible actualizar el usuario. Verifica el correo y la restricción de un solo administrador.'
            );

        }

    }
);


// =========================================================
// ELIMINAR USUARIO
// =========================================================

router.post(
    '/admin/usuarios/:id/eliminar',
    requiereAdmin,
    async (req, res) => {

        try {

            const usuarioId = Number(
                req.params.id
            );

            if (
                req.session.usuario.usuario_id === usuarioId
            ) {

                return res.status(400).send(
                    'El administrador no puede eliminar su propia cuenta mientras tiene la sesión iniciada.'
                );

            }

            await eliminarUsuario(
                usuarioId
            );

            res.redirect(
                '/library/admin/usuarios'
            );

        } catch (error) {

            console.error(
                'Error al eliminar usuario:',
                error
            );

            res.status(500).send(
                'No fue posible eliminar el usuario.'
            );

        }

    }
);


module.exports = router;