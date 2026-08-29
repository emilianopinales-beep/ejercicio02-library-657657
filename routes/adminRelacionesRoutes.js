// EJERCICIO GUIADO 02
// Rutas para relaciones de libros
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    requiereAdmin
} = require('../middleware/auth');

const {
    obtenerLibro,

    obtenerAutores,
    obtenerAutoresLibro,
    asociarAutor,
    eliminarAutor,

    obtenerGeneros,
    obtenerGenerosLibro,
    asociarGenero,
    eliminarGenero,

    obtenerConceptos,
    obtenerConceptosLibro,
    guardarConcepto,
    eliminarConcepto

} = require('../services/adminRelacionesService');

const router = express.Router();


// =========================================================
// PANTALLA DE RELACIONES DEL LIBRO
// =========================================================

router.get(
    '/admin/libros/:id/relaciones',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(req.params.id);

            if (
                !Number.isInteger(libroId) ||
                libroId <= 0
            ) {

                return res.status(400).send(
                    'ID de libro no válido.'
                );

            }

            const libro = await obtenerLibro(
                libroId
            );

            if (!libro) {

                return res.status(404).send(
                    'Libro no encontrado.'
                );

            }

            const [
                autores,
                autoresLibro,
                generos,
                generosLibro,
                conceptos,
                conceptosLibro
            ] = await Promise.all([

                obtenerAutores(),
                obtenerAutoresLibro(libroId),

                obtenerGeneros(),
                obtenerGenerosLibro(libroId),

                obtenerConceptos(),
                obtenerConceptosLibro(libroId)

            ]);

            res.render(
                'adminRelaciones',
                {
                    usuario:
                        req.session.usuario,

                    libro,

                    autores,
                    autoresLibro,

                    generos,
                    generosLibro,

                    conceptos,
                    conceptosLibro
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener relaciones:',
                error
            );

            res.status(500).send(
                'Error al obtener las relaciones del libro.'
            );

        }

    }
);


// =========================================================
// ASOCIAR AUTOR
// =========================================================

router.post(
    '/admin/libros/:id/autores/agregar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            const autorId = Number(
                req.body.autor_id
            );

            await asociarAutor(
                libroId,
                autorId
            );

            res.redirect(
                `/library/admin/libros/${libroId}/relaciones`
            );

        } catch (error) {

            console.error(
                'Error al asociar autor:',
                error
            );

            res.status(500).send(
                'No fue posible asociar el autor.'
            );

        }

    }
);


// =========================================================
// ELIMINAR AUTOR DEL LIBRO
// =========================================================

router.post(
    '/admin/libros/:id/autores/:autorId/eliminar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            const autorId = Number(
                req.params.autorId
            );

            await eliminarAutor(
                libroId,
                autorId
            );

            res.redirect(
                `/library/admin/libros/${libroId}/relaciones`
            );

        } catch (error) {

            console.error(
                'Error al eliminar autor:',
                error
            );

            res.status(500).send(
                'No fue posible eliminar la relación con el autor.'
            );

        }

    }
);


// =========================================================
// ASOCIAR GENERO
// =========================================================

router.post(
    '/admin/libros/:id/generos/agregar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            const generoId = Number(
                req.body.genero_id
            );

            await asociarGenero(
                libroId,
                generoId
            );

            res.redirect(
                `/library/admin/libros/${libroId}/relaciones`
            );

        } catch (error) {

            console.error(
                'Error al asociar género:',
                error
            );

            res.status(500).send(
                'No fue posible asociar el género.'
            );

        }

    }
);


// =========================================================
// ELIMINAR GENERO DEL LIBRO
// =========================================================

router.post(
    '/admin/libros/:id/generos/:generoId/eliminar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            const generoId = Number(
                req.params.generoId
            );

            await eliminarGenero(
                libroId,
                generoId
            );

            res.redirect(
                `/library/admin/libros/${libroId}/relaciones`
            );

        } catch (error) {

            console.error(
                'Error al eliminar género:',
                error
            );

            res.status(500).send(
                'No fue posible eliminar la relación con el género.'
            );

        }

    }
);


// =========================================================
// GUARDAR CONCEPTO DEL LIBRO
// =========================================================

router.post(
    '/admin/libros/:id/conceptos/guardar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            const conceptoId = Number(
                req.body.concepto_id
            );

            const definicion =
                req.body.definicion
                    ? req.body.definicion.trim()
                    : '';

            const referencia =
                req.body.referencia
                    ? req.body.referencia.trim()
                    : '';

            if (!definicion) {

                return res.status(400).send(
                    'La definición es obligatoria.'
                );

            }

            await guardarConcepto(
                libroId,
                conceptoId,
                definicion,
                referencia
            );

            res.redirect(
                `/library/admin/libros/${libroId}/relaciones`
            );

        } catch (error) {

            console.error(
                'Error al guardar concepto:',
                error
            );

            res.status(500).send(
                'No fue posible guardar el concepto.'
            );

        }

    }
);


// =========================================================
// ELIMINAR CONCEPTO DEL LIBRO
// =========================================================

router.post(
    '/admin/libros/:id/conceptos/:conceptoId/eliminar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            const conceptoId = Number(
                req.params.conceptoId
            );

            await eliminarConcepto(
                libroId,
                conceptoId
            );

            res.redirect(
                `/library/admin/libros/${libroId}/relaciones`
            );

        } catch (error) {

            console.error(
                'Error al eliminar concepto:',
                error
            );

            res.status(500).send(
                'No fue posible eliminar la relación con el concepto.'
            );

        }

    }
);


module.exports = router;