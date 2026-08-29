// EJERCICIO GUIADO 02
// Rutas administrativas para catalogos
// Alumno: Emiliano Pascual Pinales Sanchez
// Matricula: 657657

const express = require('express');

const {
    requiereAdmin
} = require('../middleware/auth');

const {
    obtenerRegistros,
    obtenerRegistroPorId,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro
} = require('../services/adminCatalogosService');

const router = express.Router();


// =========================================================
// CATALOGOS PERMITIDOS
// =========================================================

const nombresCatalogos = {

    formatos: 'Formatos',
    categorias: 'Categorías',
    generos: 'Géneros',
    conceptos: 'Conceptos'

};


// =========================================================
// VALIDAR CATALOGO
// =========================================================

function obtenerNombreCatalogo(tipo) {

    return nombresCatalogos[tipo] || null;

}


// =========================================================
// LISTAR REGISTROS
// =========================================================

router.get(
    '/admin/catalogos/:tipo',
    requiereAdmin,
    async (req, res) => {

        try {

            const tipo = req.params.tipo;

            const titulo = obtenerNombreCatalogo(tipo);

            if (!titulo) {

                return res.status(404).send(
                    'Catálogo no encontrado.'
                );

            }

            const registros = await obtenerRegistros(
                tipo
            );

            res.render(
                'adminCatalogos',
                {
                    usuario: req.session.usuario,
                    tipo,
                    titulo,
                    registros
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener catálogo:',
                error
            );

            res.status(500).send(
                'Error al obtener los registros.'
            );

        }

    }
);


// =========================================================
// FORMULARIO NUEVO
// =========================================================

router.get(
    '/admin/catalogos/:tipo/nuevo',
    requiereAdmin,
    (req, res) => {

        const tipo = req.params.tipo;

        const titulo = obtenerNombreCatalogo(tipo);

        if (!titulo) {

            return res.status(404).send(
                'Catálogo no encontrado.'
            );

        }

        res.render(
            'adminCatalogoFormulario',
            {
                usuario: req.session.usuario,
                tipo,
                titulo,
                registro: null
            }
        );

    }
);


// =========================================================
// CREAR
// =========================================================

router.post(
    '/admin/catalogos/:tipo/nuevo',
    requiereAdmin,
    async (req, res) => {

        try {

            const tipo = req.params.tipo;

            const titulo = obtenerNombreCatalogo(tipo);

            if (!titulo) {

                return res.status(404).send(
                    'Catálogo no encontrado.'
                );

            }

            const nombre = req.body.nombre.trim();

            if (!nombre) {

                return res.status(400).send(
                    'El nombre es obligatorio.'
                );

            }

            await crearRegistro(
                tipo,
                nombre
            );

            res.redirect(
                `/library/admin/catalogos/${tipo}`
            );

        } catch (error) {

            console.error(
                'Error al crear registro:',
                error
            );

            res.status(500).send(
                'No fue posible crear el registro.'
            );

        }

    }
);


// =========================================================
// FORMULARIO EDITAR
// =========================================================

router.get(
    '/admin/catalogos/:tipo/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const tipo = req.params.tipo;

            const titulo = obtenerNombreCatalogo(tipo);

            if (!titulo) {

                return res.status(404).send(
                    'Catálogo no encontrado.'
                );

            }

            const registroId = Number(
                req.params.id
            );

            const registro = await obtenerRegistroPorId(
                tipo,
                registroId
            );

            if (!registro) {

                return res.status(404).send(
                    'Registro no encontrado.'
                );

            }

            res.render(
                'adminCatalogoFormulario',
                {
                    usuario: req.session.usuario,
                    tipo,
                    titulo,
                    registro
                }
            );

        } catch (error) {

            console.error(
                'Error al obtener registro:',
                error
            );

            res.status(500).send(
                'Error al obtener el registro.'
            );

        }

    }
);


// =========================================================
// ACTUALIZAR
// =========================================================

router.post(
    '/admin/catalogos/:tipo/:id/editar',
    requiereAdmin,
    async (req, res) => {

        try {

            const tipo = req.params.tipo;

            const titulo = obtenerNombreCatalogo(tipo);

            if (!titulo) {

                return res.status(404).send(
                    'Catálogo no encontrado.'
                );

            }

            const registroId = Number(
                req.params.id
            );

            const nombre = req.body.nombre.trim();

            if (!nombre) {

                return res.status(400).send(
                    'El nombre es obligatorio.'
                );

            }

            await actualizarRegistro(
                tipo,
                registroId,
                nombre
            );

            res.redirect(
                `/library/admin/catalogos/${tipo}`
            );

        } catch (error) {

            console.error(
                'Error al actualizar registro:',
                error
            );

            res.status(500).send(
                'No fue posible actualizar el registro.'
            );

        }

    }
);


// =========================================================
// ELIMINAR
// =========================================================

router.post(
    '/admin/catalogos/:tipo/:id/eliminar',
    requiereAdmin,
    async (req, res) => {

        try {

            const tipo = req.params.tipo;

            const titulo = obtenerNombreCatalogo(tipo);

            if (!titulo) {

                return res.status(404).send(
                    'Catálogo no encontrado.'
                );

            }

            const registroId = Number(
                req.params.id
            );

            await eliminarRegistro(
                tipo,
                registroId
            );

            res.redirect(
                `/library/admin/catalogos/${tipo}`
            );

        } catch (error) {

            console.error(
                'Error al eliminar registro:',
                error
            );

            res.status(500).send(
                'No fue posible eliminar el registro. Puede estar siendo utilizado por otro registro.'
            );

        }

    }
);


module.exports = router;