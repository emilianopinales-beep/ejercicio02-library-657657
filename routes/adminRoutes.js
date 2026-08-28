// EJERCICIO GUIADO 02
// Rutas del administrador
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    requiereAdmin
} = require('../middleware/auth');

const {
    obtenerLibrosAdmin,
    obtenerLibroPorId,
    obtenerFormatos,
    obtenerCategorias,
    crearLibro,
    actualizarLibro,
    eliminarLibro
} = require('../services/adminService');

const router = express.Router();


// =========================================================
// PANEL PRINCIPAL DEL ADMINISTRADOR
// =========================================================

router.get(
    '/admin',
    requiereAdmin,
    (req, res) => {

        res.render(
            'admin',
            {
                usuario: req.session.usuario
            }
        );

    }
);


// =========================================================
// LISTA DE LIBROS
// =========================================================

router.get(
    '/admin/libros',
    requiereAdmin,
    async (req, res) => {

        try {

            const libros = await obtenerLibrosAdmin();

            res.render(
                'adminLibros',
                {
                    usuario: req.session.usuario,
                    libros
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener libros:',
                error
            );

            res.status(500).send(
                'Error al obtener los libros.'
            );

        }

    }
);


// =========================================================
// FORMULARIO NUEVO LIBRO
// =========================================================

router.get(
    '/admin/libros/nuevo',
    requiereAdmin,
    async (req, res) => {

        try {

            const formatos = await obtenerFormatos();
            const categorias = await obtenerCategorias();

            res.render(
                'adminLibroNuevo',
                {
                    usuario: req.session.usuario,
                    formatos,
                    categorias
                }
            );

        } catch (error) {

            console.error(
                'Error al abrir formulario:',
                error
            );

            res.status(500).send(
                'Error al abrir el formulario.'
            );

        }

    }
);


// =========================================================
// CREAR LIBRO
// =========================================================

router.post(
    '/admin/libros/nuevo',
    requiereAdmin,
    async (req, res) => {

        try {

            const datos = {
                isbn: req.body.isbn,
                titulo: req.body.titulo,
                anio_publicacion: Number(
                    req.body.anio_publicacion
                ),
                precio: Number(
                    req.body.precio
                ),
                stock: Number(
                    req.body.stock
                ),
                formato_id: Number(
                    req.body.formato_id
                ),
                categoria_id: Number(
                    req.body.categoria_id
                )
            };

            await crearLibro(datos);

            res.redirect(
                '/library/admin/libros'
            );

        } catch (error) {

            console.error(
                'Error al crear libro:',
                error
            );

            res.status(500).send(
                'No fue posible crear el libro.'
            );

        }

    }
);


// =========================================================
// FORMULARIO EDITAR LIBRO
// =========================================================

router.get(
    '/admin/libros/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            const libro = await obtenerLibroPorId(
                libroId
            );

            if (!libro) {

                return res.status(404).send(
                    'Libro no encontrado.'
                );

            }

            const formatos = await obtenerFormatos();
            const categorias = await obtenerCategorias();

            res.render(
                'adminLibroEditar',
                {
                    usuario: req.session.usuario,
                    libro,
                    formatos,
                    categorias
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener libro:',
                error
            );

            res.status(500).send(
                'Error al obtener el libro.'
            );

        }

    }
);


// =========================================================
// ACTUALIZAR LIBRO
// =========================================================

router.post(
    '/admin/libros/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            const datos = {
                isbn: req.body.isbn,
                titulo: req.body.titulo,
                anio_publicacion: Number(
                    req.body.anio_publicacion
                ),
                precio: Number(
                    req.body.precio
                ),
                stock: Number(
                    req.body.stock
                ),
                formato_id: Number(
                    req.body.formato_id
                ),
                categoria_id: Number(
                    req.body.categoria_id
                )
            };

            await actualizarLibro(
                libroId,
                datos
            );

            res.redirect(
                '/library/admin/libros'
            );

        } catch (error) {

            console.error(
                'Error al actualizar libro:',
                error
            );

            res.status(500).send(
                'No fue posible actualizar el libro.'
            );

        }

    }
);


// =========================================================
// ELIMINAR LIBRO
// =========================================================

router.post(
    '/admin/libros/:id/eliminar',
    requiereAdmin,
    async (req, res) => {

        try {

            const libroId = Number(
                req.params.id
            );

            await eliminarLibro(
                libroId
            );

            res.redirect(
                '/library/admin/libros'
            );

        } catch (error) {

            console.error(
                'Error al eliminar libro:',
                error
            );

            res.status(500).send(
                'No fue posible eliminar el libro.'
            );

        }

    }
);


module.exports = router;