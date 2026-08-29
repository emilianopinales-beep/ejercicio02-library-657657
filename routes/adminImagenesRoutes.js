// EJERCICIO GUIADO 02
// Rutas administrativas para imagenes
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const {
    requiereAdmin
} = require('../middleware/auth');

const {
    obtenerImagenes,
    obtenerLibrosParaImagen,
    obtenerImagenPorId,
    crearImagen,
    actualizarImagen,
    eliminarImagen
} = require('../services/adminImagenesService');

const router = express.Router();


// =========================================================
// CONFIGURACION DE CARGA
// =========================================================

const carpetaUploads = path.join(
    __dirname,
    '..',
    'uploads'
);

if (!fs.existsSync(carpetaUploads)) {

    fs.mkdirSync(
        carpetaUploads,
        {
            recursive: true
        }
    );

}


const almacenamiento = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            carpetaUploads
        );

    },

    filename: function (
        req,
        file,
        cb
    ) {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        const nombreInterno =
            crypto.randomUUID() +
            extension;

        cb(
            null,
            nombreInterno
        );

    }

});


function validarArchivo(
    req,
    file,
    cb
) {

    const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];

    const extensionesPermitidas = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp'
    ];

    const extension =
        path.extname(
            file.originalname
        ).toLowerCase();

    if (
        tiposPermitidos.includes(
            file.mimetype
        ) &&
        extensionesPermitidas.includes(
            extension
        )
    ) {

        return cb(
            null,
            true
        );

    }

    cb(
        new Error(
            'Solo se permiten archivos JPG, PNG o WebP.'
        )
    );

}


const upload = multer({

    storage: almacenamiento,

    fileFilter: validarArchivo,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


// =========================================================
// LISTAR IMAGENES
// =========================================================

router.get(
    '/admin/imagenes',
    requiereAdmin,
    async (req, res) => {

        try {

            const imagenes =
                await obtenerImagenes();

            res.render(
                'adminImagenes',
                {
                    usuario:
                        req.session.usuario,

                    imagenes
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener imagenes:',
                error
            );

            res.status(500).send(
                'Error al obtener las imágenes.'
            );

        }

    }
);


// =========================================================
// FORMULARIO NUEVA IMAGEN
// =========================================================

router.get(
    '/admin/imagenes/nueva',
    requiereAdmin,
    async (req, res) => {

        try {

            const libros =
                await obtenerLibrosParaImagen();

            res.render(
                'adminImagenNueva',
                {
                    usuario:
                        req.session.usuario,

                    libros
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
// GUARDAR NUEVA IMAGEN
// =========================================================

router.post(
    '/admin/imagenes/nueva',
    requiereAdmin,
    upload.single('imagen'),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).send(
                    'Debes seleccionar una imagen.'
                );

            }

            const libroId = Number(
                req.body.libro_id
            );

            const esPortada =
                req.body.es_portada === 'on';

            const textoAlt =
                req.body.texto_alt
                    ? req.body.texto_alt.trim()
                    : '';

            await crearImagen({

                libro_id: libroId,

                nombre_archivo:
                    req.file.originalname,

                ruta_relativa:
                    `uploads/${req.file.filename}`,

                mime_type:
                    req.file.mimetype,

                tamanio_bytes:
                    req.file.size,

                es_portada:
                    esPortada,

                texto_alt:
                    textoAlt

            });

            res.redirect(
                '/library/admin/imagenes'
            );

        } catch (error) {

            if (req.file) {

                const rutaArchivo =
                    path.join(
                        carpetaUploads,
                        req.file.filename
                    );

                if (
                    fs.existsSync(
                        rutaArchivo
                    )
                ) {

                    fs.unlinkSync(
                        rutaArchivo
                    );

                }

            }

            console.error(
                'Error al guardar imagen:',
                error
            );

            res.status(500).send(
                'No fue posible guardar la imagen.'
            );

        }

    }
);


// =========================================================
// FORMULARIO EDITAR IMAGEN
// =========================================================

router.get(
    '/admin/imagenes/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const imagenId = Number(
                req.params.id
            );

            const imagen =
                await obtenerImagenPorId(
                    imagenId
                );

            if (!imagen) {

                return res.status(404).send(
                    'Imagen no encontrada.'
                );

            }

            const libros =
                await obtenerLibrosParaImagen();

            res.render(
                'adminImagenEditar',
                {
                    usuario:
                        req.session.usuario,

                    imagen,
                    libros
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener imagen:',
                error
            );

            res.status(500).send(
                'Error al obtener la imagen.'
            );

        }

    }
);


// =========================================================
// ACTUALIZAR DATOS DE IMAGEN
// =========================================================

router.post(
    '/admin/imagenes/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const imagenId = Number(
                req.params.id
            );

            const libroId = Number(
                req.body.libro_id
            );

            const esPortada =
                req.body.es_portada === 'on';

            const textoAlt =
                req.body.texto_alt
                    ? req.body.texto_alt.trim()
                    : '';

            await actualizarImagen(
                imagenId,
                {
                    libro_id:
                        libroId,

                    es_portada:
                        esPortada,

                    texto_alt:
                        textoAlt
                }
            );

            res.redirect(
                '/library/admin/imagenes'
            );

        } catch (error) {

            console.error(
                'Error al actualizar imagen:',
                error
            );

            res.status(500).send(
                'No fue posible actualizar la imagen.'
            );

        }

    }
);


// =========================================================
// ELIMINAR IMAGEN
// =========================================================

router.post(
    '/admin/imagenes/:id/eliminar',
    requiereAdmin,
    async (req, res) => {

        try {

            const imagenId = Number(
                req.params.id
            );

            const imagen =
                await obtenerImagenPorId(
                    imagenId
                );

            if (!imagen) {

                return res.status(404).send(
                    'Imagen no encontrada.'
                );

            }

            await eliminarImagen(
                imagenId
            );

            const rutaArchivo =
                path.join(
                    __dirname,
                    '..',
                    imagen.ruta_relativa
                );

            if (
                fs.existsSync(
                    rutaArchivo
                )
            ) {

                fs.unlinkSync(
                    rutaArchivo
                );

            }

            res.redirect(
                '/library/admin/imagenes'
            );

        } catch (error) {

            console.error(
                'Error al eliminar imagen:',
                error
            );

            res.status(500).send(
                'No fue posible eliminar la imagen.'
            );

        }

    }
);


module.exports = router;