// EJERCICIO GUIADO 02
// Rutas administrativas para autores
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    requiereAdmin
} = require('../middleware/auth');

const {
    obtenerAutores,
    obtenerAutorPorId,
    crearAutor,
    actualizarAutor,
    eliminarAutor
} = require('../services/adminAutoresService');

const router = express.Router();


// =========================================================
// LISTAR AUTORES
// =========================================================

router.get(
    '/admin/autores',
    requiereAdmin,
    async (req, res) => {

        try {

            const autores = await obtenerAutores();

            res.render(
                'adminAutores',
                {
                    usuario: req.session.usuario,
                    autores
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener autores:',
                error
            );

            res.status(500).send(
                'Error al obtener los autores.'
            );

        }

    }
);


// =========================================================
// FORMULARIO NUEVO AUTOR
// =========================================================

router.get(
    '/admin/autores/nuevo',
    requiereAdmin,
    (req, res) => {

        res.render(
            'adminAutorFormulario',
            {
                usuario: req.session.usuario,
                autor: null
            }
        );

    }
);


// =========================================================
// CREAR AUTOR
// =========================================================

router.post(
    '/admin/autores/nuevo',
    requiereAdmin,
    async (req, res) => {

        try {

            const datos = {
                nombre: req.body.nombre.trim(),
                nacionalidad: req.body.nacionalidad.trim()
            };

            if (!datos.nombre) {

                return res.status(400).send(
                    'El nombre es obligatorio.'
                );

            }

            await crearAutor(datos);

            res.redirect(
                '/library/admin/autores'
            );

        } catch (error) {

            console.error(
                'Error al crear autor:',
                error
            );

            res.status(500).send(
                'No fue posible crear el autor.'
            );

        }

    }
);


// =========================================================
// FORMULARIO EDITAR AUTOR
// =========================================================

router.get(
    '/admin/autores/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const autorId = Number(
                req.params.id
            );

            const autor = await obtenerAutorPorId(
                autorId
            );

            if (!autor) {

                return res.status(404).send(
                    'Autor no encontrado.'
                );

            }

            res.render(
                'adminAutorFormulario',
                {
                    usuario: req.session.usuario,
                    autor
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener autor:',
                error
            );

            res.status(500).send(
                'Error al obtener el autor.'
            );

        }

    }
);


// =========================================================
// ACTUALIZAR AUTOR
// =========================================================

router.post(
    '/admin/autores/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const autorId = Number(
                req.params.id
            );

            const datos = {
                nombre: req.body.nombre.trim(),
                nacionalidad: req.body.nacionalidad.trim()
            };

            if (!datos.nombre) {

                return res.status(400).send(
                    'El nombre es obligatorio.'
                );

            }

            await actualizarAutor(
                autorId,
                datos
            );

            res.redirect(
                '/library/admin/autores'
            );

        } catch (error) {

            console.error(
                'Error al actualizar autor:',
                error
            );

            res.status(500).send(
                'No fue posible actualizar el autor.'
            );

        }

    }
);


// =========================================================
// ELIMINAR AUTOR
// =========================================================

router.post(
    '/admin/autores/:id/eliminar',
    requiereAdmin,
    async (req, res) => {

        try {

            const autorId = Number(
                req.params.id
            );

            await eliminarAutor(
                autorId
            );

            res.redirect(
                '/library/admin/autores'
            );

        } catch (error) {

            console.error(
                'Error al eliminar autor:',
                error
            );

            res.status(500).send(
                'No fue posible eliminar el autor. Puede estar relacionado con un libro.'
            );

        }

    }
);


module.exports = router;