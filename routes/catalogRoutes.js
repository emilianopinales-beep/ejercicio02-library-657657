// EJERCICIO GUIADO 02
// Rutas del catalogo
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    obtenerCatalogo,
    buscarLibros
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
                    usuario:
                        req.session.usuario,

                    libros:
                        libros,

                    busqueda:
                        busqueda,

                    mensaje:
                        null
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
                    usuario:
                        req.session.usuario,

                    libros: [],

                    busqueda: '',

                    mensaje:
                        'No fue posible consultar el catálogo.'
                }
            );

        }

    }
);


module.exports = router;