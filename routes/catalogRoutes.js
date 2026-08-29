// EJERCICIO GUIADO 02
// Rutas del catalogo
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    requiereSesion
} = require('../middleware/auth');

const {
    obtenerCatalogo,
    buscarLibros,
    obtenerDetalleLibro,
    obtenerConceptosLibro,
    obtenerImagenesLibro
} = require('../services/catalogService');

const router = express.Router();


// =========================================================
// CATALOGO
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

                libros = await buscarLibros(
                    busqueda
                );

            } else {

                libros = await obtenerCatalogo();

            }

            res.render(
                'catalogo',
                {
                    usuario:
                        req.session.usuario,

                    libros,

                    busqueda
                }
            );

        } catch (error) {

            console.error(
                'Error al cargar catalogo:',
                error
            );

            res.status(500).send(
                'Error al cargar el catálogo.'
            );

        }

    }
);


// =========================================================
// DETALLE DEL LIBRO
// =========================================================

router.get(
    '/libro/:id',
    requiereSesion,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            if (
                !Number.isInteger(libroId) ||
                libroId <= 0
            ) {

                return res.status(400).send(
                    'ID de libro no válido.'
                );

            }

            const libro =
                await obtenerDetalleLibro(
                    libroId
                );

            if (!libro) {

                return res.status(404).send(
                    'Libro no encontrado.'
                );

            }

            const conceptos =
                await obtenerConceptosLibro(
                    libroId
                );

            const imagenes =
                await obtenerImagenesLibro(
                    libroId
                );

            res.render(
                'detalleLibro',
                {
                    usuario:
                        req.session.usuario,

                    libro,

                    conceptos,

                    imagenes
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener detalle del libro:',
                error
            );

            res.status(500).send(
                'Error al obtener el detalle del libro.'
            );

        }

    }
);


module.exports = router;