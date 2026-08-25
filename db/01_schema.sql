-- EJERCICIO GUIADO 02
-- Esquema de base de datos normalizado hasta 4FN
-- Alumno: Emiliano Pascual Pinales Sanchez
-- Matrícula: 657657

-- =========================================================
-- TABLA: usuario
-- =========================================================

CREATE TABLE usuario (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuario_rol
        CHECK (rol IN ('usuario', 'administrador'))
);

-- Como máximo puede existir un administrador.
CREATE UNIQUE INDEX uq_un_solo_administrador
ON usuario (rol)
WHERE rol = 'administrador';


-- =========================================================
-- TABLA: formato
-- =========================================================

CREATE TABLE formato (
    formato_id SERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE
);


-- =========================================================
-- TABLA: categoria
-- =========================================================

CREATE TABLE categoria (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);


-- =========================================================
-- TABLA: libro
-- =========================================================

CREATE TABLE libro (
    libro_id SERIAL PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    anio_publicacion INTEGER NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    formato_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,

    CONSTRAINT chk_libro_anio
        CHECK (anio_publicacion BETWEEN 1000 AND 2100),

    CONSTRAINT chk_libro_precio
        CHECK (precio >= 0),

    CONSTRAINT chk_libro_stock
        CHECK (stock >= 0),

    CONSTRAINT fk_libro_formato
        FOREIGN KEY (formato_id)
        REFERENCES formato(formato_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_libro_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categoria(categoria_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_libro_titulo
ON libro (titulo);

CREATE INDEX idx_libro_formato
ON libro (formato_id);

CREATE INDEX idx_libro_categoria
ON libro (categoria_id);


-- =========================================================
-- TABLA: autor
-- =========================================================

CREATE TABLE autor (
    autor_id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nacionalidad VARCHAR(100)
);

CREATE INDEX idx_autor_nombre
ON autor (nombre);


-- =========================================================
-- TABLA PUENTE: libro_autor
-- Relación muchos a muchos entre libro y autor
-- =========================================================

CREATE TABLE libro_autor (
    libro_id INTEGER NOT NULL,
    autor_id INTEGER NOT NULL,

    PRIMARY KEY (libro_id, autor_id),

    CONSTRAINT fk_libro_autor_libro
        FOREIGN KEY (libro_id)
        REFERENCES libro(libro_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_libro_autor_autor
        FOREIGN KEY (autor_id)
        REFERENCES autor(autor_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_libro_autor_autor
ON libro_autor (autor_id);


-- =========================================================
-- TABLA: genero
-- =========================================================

CREATE TABLE genero (
    genero_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);


-- =========================================================
-- TABLA PUENTE: libro_genero
-- Relación muchos a muchos entre libro y genero
-- =========================================================

CREATE TABLE libro_genero (
    libro_id INTEGER NOT NULL,
    genero_id INTEGER NOT NULL,

    PRIMARY KEY (libro_id, genero_id),

    CONSTRAINT fk_libro_genero_libro
        FOREIGN KEY (libro_id)
        REFERENCES libro(libro_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_libro_genero_genero
        FOREIGN KEY (genero_id)
        REFERENCES genero(genero_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_libro_genero_genero
ON libro_genero (genero_id);


-- =========================================================
-- TABLA: concepto
-- =========================================================

CREATE TABLE concepto (
    concepto_id SERIAL PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL UNIQUE
);


-- =========================================================
-- TABLA PUENTE: libro_concepto
-- La definición depende de la combinación libro + concepto
-- =========================================================

CREATE TABLE libro_concepto (
    libro_id INTEGER NOT NULL,
    concepto_id INTEGER NOT NULL,
    definicion TEXT NOT NULL,
    referencia VARCHAR(150),

    PRIMARY KEY (libro_id, concepto_id),

    CONSTRAINT fk_libro_concepto_libro
        FOREIGN KEY (libro_id)
        REFERENCES libro(libro_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_libro_concepto_concepto
        FOREIGN KEY (concepto_id)
        REFERENCES concepto(concepto_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_libro_concepto_concepto
ON libro_concepto (concepto_id);


-- =========================================================
-- TABLA: imagen
-- Las imágenes se almacenan físicamente en uploads.
-- PostgreSQL conserva únicamente sus metadatos.
-- =========================================================

CREATE TABLE imagen (
    imagen_id SERIAL PRIMARY KEY,
    libro_id INTEGER NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_relativa VARCHAR(500) NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    tamanio_bytes BIGINT NOT NULL,
    es_portada BOOLEAN NOT NULL DEFAULT FALSE,
    texto_alt VARCHAR(255),

    CONSTRAINT chk_imagen_mime
        CHECK (
            mime_type IN (
                'image/jpeg',
                'image/png',
                'image/webp'
            )
        ),

    CONSTRAINT chk_imagen_tamanio
        CHECK (tamanio_bytes > 0),

    CONSTRAINT fk_imagen_libro
        FOREIGN KEY (libro_id)
        REFERENCES libro(libro_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_imagen_libro
ON imagen (libro_id);

-- Un libro puede tener varias imágenes,
-- pero solamente una puede marcarse como portada.
CREATE UNIQUE INDEX uq_imagen_portada_por_libro
ON imagen (libro_id)
WHERE es_portada = TRUE;