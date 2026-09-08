from __future__ import annotations

import hashlib
import logging
import os
import time
import xml.etree.ElementTree as ET
from decimal import Decimal
from pathlib import Path

import psycopg2
from dotenv import dotenv_values, load_dotenv
from flask import Flask, Response, jsonify, request
from psycopg2.extras import RealDictCursor

from config.settings import Settings
from db.repository import PostgreSQLRepository
from soap.envelope import fault
from soap.faults import SoapFault
from soap.service import dispatch


BASE_DIR = Path(__file__).resolve().parent

# Configuración del SOAP original.
load_dotenv(BASE_DIR / ".env")
load_dotenv("/opt/library_soap_service/.env")


def web_db_connection():
    """
    Conexión de solo lectura práctica a la BD completa utilizada
    por el monolito del Ejercicio Guiado 02.
    """
    local_env = BASE_DIR / ".env"

    if local_env.exists():
        env = dotenv_values(local_env)
    else:
        env = dotenv_values("/opt/web_library/.env")

    return psycopg2.connect(
        host=env["DB_HOST"],
        port=env["DB_PORT"],
        dbname=env["DB_NAME"],
        user=env["DB_USER"],
        password=env["DB_PASSWORD"],
    )


def normalize(value):
    if isinstance(value, Decimal):
        return float(value)
    return value


def normalize_row(row):
    return {key: normalize(value) for key, value in dict(row).items()}


XML_ITEMS = {
    "libros": "libro",
    "autores": "autor",
    "conceptos": "concepto",
    "imagenes": "imagen",
}


def append_xml(parent, key, value):
    if isinstance(value, dict):
        node = ET.SubElement(parent, key)
        for child_key, child_value in value.items():
            append_xml(node, child_key, child_value)

    elif isinstance(value, list):
        container = ET.SubElement(parent, key)
        item_name = XML_ITEMS.get(key, "item")

        for item in value:
            node = ET.SubElement(container, item_name)

            if isinstance(item, dict):
                for child_key, child_value in item.items():
                    append_xml(node, child_key, child_value)
            else:
                node.text = "" if item is None else str(item)

    else:
        node = ET.SubElement(parent, key)
        node.text = "" if value is None else str(value)


def xml_response(root_name, data, status=200):
    root = ET.Element(root_name)

    if isinstance(data, dict):
        for key, value in data.items():
            append_xml(root, key, value)
    else:
        append_xml(root, "resultado", data)

    ET.indent(root, space="  ")
    content = ET.tostring(
        root,
        encoding="utf-8",
        xml_declaration=True,
    )

    return Response(
        content,
        status=status,
        content_type="application/xml; charset=utf-8",
    )


def bilingual_response(data, root_name="respuesta", status=200):
    formato = request.args.get("format", "xml").strip().lower()

    if formato == "json":
        return jsonify(data), status

    if formato in {"", "xml"}:
        return xml_response(root_name, data, status)

    error = {
        "error": "Formato no soportado",
        "formatos_permitidos": ["xml", "json"],
    }
    return xml_response("error", error, 400)


def get_book_details(cur, row):
    book = normalize_row(row)
    libro_id = book.pop("libro_id")

    cur.execute(
        """
        SELECT a.nombre
        FROM autor a
        INNER JOIN libro_autor la
            ON la.autor_id = a.autor_id
        WHERE la.libro_id = %s
        ORDER BY a.nombre
        """,
        (libro_id,),
    )
    book["autores"] = [r["nombre"] for r in cur.fetchall()]

    cur.execute(
        """
        SELECT
            c.nombre,
            lc.definicion,
            lc.referencia
        FROM concepto c
        INNER JOIN libro_concepto lc
            ON lc.concepto_id = c.concepto_id
        WHERE lc.libro_id = %s
        ORDER BY c.nombre
        """,
        (libro_id,),
    )
    book["conceptos"] = [
        normalize_row(r)
        for r in cur.fetchall()
    ]

    cur.execute(
        """
        SELECT
            nombre_archivo,
            ruta_relativa,
            mime_type,
            es_portada,
            texto_alt
        FROM imagen
        WHERE libro_id = %s
        ORDER BY es_portada DESC, imagen_id
        """,
        (libro_id,),
    )
    book["imagenes"] = [
        normalize_row(r)
        for r in cur.fetchall()
    ]

    return book


def fetch_books(isbn=None):
    conn = web_db_connection()

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        sql = """
            SELECT
                libro_id,
                isbn,
                titulo,
                anio_publicacion,
                precio,
                stock
            FROM libro
        """

        params = ()

        if isbn is not None:
            sql += " WHERE isbn = %s"
            params = (isbn,)

        sql += " ORDER BY titulo"

        cur.execute(sql, params)

        books = [
            get_book_details(cur, row)
            for row in cur.fetchall()
        ]

        cur.close()
        return books

    finally:
        conn.close()


def fetch_cloud_concepts():
    conn = web_db_connection()

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute(
            """
            SELECT concepto_id, nombre
            FROM concepto
            WHERE LOWER(nombre) IN ('iaas', 'paas', 'saas', 'faas')
            ORDER BY
                CASE LOWER(nombre)
                    WHEN 'iaas' THEN 1
                    WHEN 'paas' THEN 2
                    WHEN 'saas' THEN 3
                    WHEN 'faas' THEN 4
                    ELSE 5
                END
            """
        )

        concepts = []

        for concept in cur.fetchall():
            cur.execute(
                """
                SELECT
                    l.isbn,
                    l.titulo,
                    l.anio_publicacion,
                    l.precio,
                    l.stock,
                    lc.definicion,
                    lc.referencia
                FROM libro l
                INNER JOIN libro_concepto lc
                    ON lc.libro_id = l.libro_id
                WHERE lc.concepto_id = %s
                ORDER BY l.titulo
                """,
                (concept["concepto_id"],),
            )

            concepts.append(
                {
                    "concepto": concept["nombre"],
                    "libros": [
                        normalize_row(row)
                        for row in cur.fetchall()
                    ],
                }
            )

        cur.close()
        return concepts

    finally:
        conn.close()


def fetch_minimal_books():
    conn = web_db_connection()

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute(
            """
            SELECT libro_id, isbn, titulo
            FROM libro
            ORDER BY titulo
            """
        )

        books = []

        for row in cur.fetchall():
            libro_id = row["libro_id"]

            cur.execute(
                """
                SELECT
                    nombre_archivo,
                    ruta_relativa,
                    mime_type,
                    es_portada,
                    texto_alt
                FROM imagen
                WHERE libro_id = %s
                ORDER BY es_portada DESC, imagen_id
                """,
                (libro_id,),
            )

            books.append(
                {
                    "isbn": row["isbn"],
                    "titulo": row["titulo"],
                    "imagenes": [
                        normalize_row(image)
                        for image in cur.fetchall()
                    ],
                }
            )

        cur.close()
        return books

    finally:
        conn.close()


def create_app(repository=None, settings: Settings | None = None) -> Flask:
    settings = settings or Settings()

    repository = repository or PostgreSQLRepository(
        settings.database_dsn,
        settings.db_min_connections,
        settings.db_max_connections,
    )

    app = Flask(__name__)

    app.config["MAX_CONTENT_LENGTH"] = settings.soap_max_body_bytes
    app.config["SOAP_REPOSITORY"] = repository

    # ---------------------------------------------------------
    # Endpoint de salud bilingüe
    # ---------------------------------------------------------
    @app.get("/health")
    def health():
        return bilingual_response(
            {
                "status": "ok",
                "service": "library-microservice-bilingue",
            },
            "health",
        )

    # ---------------------------------------------------------
    # Catálogo completo
    # XML por defecto
    # /books?format=json
    # ---------------------------------------------------------
    @app.get("/books")
    def books():
        books_data = fetch_books()

        return bilingual_response(
            {
                "total": len(books_data),
                "libros": books_data,
            },
            "catalogo",
        )

    # ---------------------------------------------------------
    # Libro individual por ISBN
    # /books/<isbn>
    # /books/<isbn>?format=json
    # ---------------------------------------------------------
    @app.get("/books/<isbn>")
    def book_by_isbn(isbn):
        books_data = fetch_books(isbn)

        if not books_data:
            return bilingual_response(
                {
                    "error": "Libro no encontrado",
                    "isbn": isbn,
                },
                "error",
                404,
            )

        return bilingual_response(
            books_data[0],
            "libro",
        )

    # ---------------------------------------------------------
    # Conceptos Cloud Computing junto con libros relacionados
    # IaaS, PaaS, SaaS y FaaS
    # ---------------------------------------------------------
    @app.get("/concepts/cloud")
    def cloud_concepts():
        concepts = fetch_cloud_concepts()

        return bilingual_response(
            {
                "total": len(concepts),
                "conceptos": concepts,
            },
            "cloudComputing",
        )

    # ---------------------------------------------------------
    # Datos mínimos de libros junto con imágenes
    # ---------------------------------------------------------
    @app.get("/books/minimal")
    def minimal_books():
        books_data = fetch_minimal_books()

        return bilingual_response(
            {
                "total": len(books_data),
                "libros": books_data,
            },
            "catalogoMinimo",
        )

    # ---------------------------------------------------------
    # WSDL original
    # ---------------------------------------------------------
    @app.get("/wsdl")
    def wsdl():
        document = (
            BASE_DIR / "wsdl" / "library-classifier.wsdl"
        ).read_text(encoding="utf-8")

        document = document.replace(
            "http://127.0.0.1:5001/soap",
            settings.public_soap_url,
        )

        return Response(
            document,
            content_type="text/xml; charset=utf-8",
        )

    # ---------------------------------------------------------
    # Endpoint SOAP original
    # ---------------------------------------------------------
    @app.post("/soap")
    def soap_endpoint():
        started = time.perf_counter()
        operation = "desconocida"
        fault_code = None
        status = 200

        try:
            if request.mimetype not in {
                "text/xml",
                "application/soap+xml",
            }:
                raise SoapFault(
                    "Client.ContentType",
                    "Content-Type SOAP invalido",
                    415,
                )

            payload, operation = dispatch(
                request.get_data(cache=False),
                repository,
            )

        except SoapFault as exc:
            status = exc.http_status
            fault_code = exc.code
            payload = fault(exc.code, exc.message)

        except Exception:
            logging.exception("Fallo interno procesando SOAP")
            status = 500
            fault_code = "Server.Database"
            payload = fault(
                "Server.Database",
                "No fue posible completar la operacion",
            )

        finally:
            elapsed = round(
                (time.perf_counter() - started) * 1000
            )

            client = hashlib.sha256(
                (request.remote_addr or "unknown").encode()
            ).hexdigest()[:16]

            repository.record_request(
                client,
                operation,
                elapsed,
                status < 400,
                fault_code,
            )

        return Response(
            payload,
            status=status,
            content_type="text/xml; charset=utf-8",
        )

    @app.errorhandler(413)
    def too_large(_error):
        return Response(
            fault(
                "Client.MessageTooLarge",
                "El mensaje SOAP excede el limite permitido",
            ),
            status=413,
            content_type="text/xml; charset=utf-8",
        )

    return app


if __name__ == "__main__":
    configuration = Settings()

    create_app(settings=configuration).run(
        host="0.0.0.0",
        port=int(
            os.getenv(
                "ACTIVITY_PORT",
                configuration.app_port,
            )
        ),
        debug=False,
    )
