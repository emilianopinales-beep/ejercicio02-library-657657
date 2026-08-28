// EJERCICIO GUIADO 02
// Rutas del catalogo
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    obtenerCatalogo,
    buscarLibros,
    obtenerDetalleLibro,
    obtenerConceptosLibro
} = require('../services/catalogService');

const {
    requiereSesion
} = require('../middleware/auth');

const router = express.Router();


// =========================================================
// MOSTRAR CATALOGO
// =========================================================

router.get(
    '/catalogo',
    requiereSesion,
    async (req, res) => {

        try {

            const busqueda =
                req.query.busqueda
                    ? req.query.busqueda.trim()
                    : '';

            let libros;

            if (busqueda) {

                libros =
                    await buscarLibros(busqueda);

            } else {

                libros =
                    await obtenerCatalogo();

            }

            res.render(
                'catalogo',
                {
                    usuario: req.session.usuario,
                    libros: libros,
                    busqueda: busqueda,
                    mensaje: null
                }
            );

        } catch (error) {

            console.error(
                'Error al consultar catalogo:',
                error.message
            );

            res.status(500).render(
                'catalogo',
                {
                    usuario: req.session.usuario,
                    libros: [],
                    busqueda: '',
                    mensaje:
                        'No fue posible consultar el catálogo.'
                }
            );

        }

    }
);


// =========================================================
// DETALLE DE LIBRO
// =========================================================

router.get(
    '/libro/:id',
    requiereSesion,
    async (req, res) => {

        try {

            const libroId =
                Number(req.params.id);

            if (
                !Number.isInteger(libroId) ||
                libroId <= 0
            ) {

                return res.status(400).send(
                    'Identificador de libro inválido.'
                );

            }

            const libro =
                await obtenerDetalleLibro(libroId);

            if (!libro) {

                return res.status(404).send(
                    'Libro no encontrado.'
                );

            }

            const conceptos =
                await obtenerConceptosLibro(libroId);

            res.render(
                'detalleLibro',
                {
                    usuario:
                        req.session.usuario,

                    libro:
                        libro,

                    conceptos:
                        conceptos
                }
            );

        } catch (error) {

            console.error(
                'Error al consultar detalle del libro:',
                error.message
            );

            res.status(500).send(
                'No fue posible consultar el libro.'
            );

        }

    }
);


module.exports = router;