from __future__ import annotations

from contextlib import contextmanager
from typing import Any, Iterator

import bcrypt
from psycopg2 import errors
from psycopg2.extras import RealDictCursor
from psycopg2.pool import ThreadedConnectionPool


class DuplicateClassificationError(Exception):
    pass


class ConceptNotFoundError(Exception):
    pass


class PostgreSQLRepository:
    """Repositorio independiente; no importa ni modifica codigo del monolito."""

    def __init__(self, dsn: str, min_connections: int = 1, max_connections: int = 5):
        self.pool = ThreadedConnectionPool(min_connections, max_connections, dsn)

    @contextmanager
    def connection(self) -> Iterator[Any]:
        connection = self.pool.getconn()
        try:
            yield connection
        finally:
            self.pool.putconn(connection)

    def close(self) -> None:
        self.pool.closeall()

    def authenticate(self, username: str, password: str) -> int | None:
        with self.connection() as connection, connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT clasificador_id, password_hash
                FROM clasificadores
                WHERE usuario = %s AND activo = TRUE
                """,
                (username,),
            )
            row = cursor.fetchone()
        if not row:
            return None
        valid = bcrypt.checkpw(password.encode("utf-8"), row["password_hash"].encode("utf-8"))
        return int(row["clasificador_id"]) if valid else None

    def pending_concepts(self, classifier_id: int, limit: int) -> list[dict[str, Any]]:
        with self.connection() as connection, connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT c.concepto_id, c.nombre,
                       STRING_AGG(DISTINCT lc.definicion, ' | ' ORDER BY lc.definicion) AS definicion
                FROM concepto AS c
                JOIN libro_concepto AS lc ON lc.concepto_id = c.concepto_id
                LEFT JOIN clasificaciones_cloud AS cc
                  ON cc.concepto_id = c.concepto_id
                 AND cc.clasificador_id = %s
                WHERE cc.clasificacion_id IS NULL
                GROUP BY c.concepto_id, c.nombre
                ORDER BY c.concepto_id
                LIMIT %s
                """,
                (classifier_id, limit),
            )
            return [dict(row) for row in cursor.fetchall()]

    def register_classification(
        self,
        classifier_id: int,
        concept_id: int,
        model: str,
        confidence: float | None,
        observations: str | None,
    ) -> int:
        with self.connection() as connection:
            try:
                with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                    cursor.execute("SELECT 1 FROM concepto WHERE concepto_id = %s", (concept_id,))
                    if cursor.fetchone() is None:
                        raise ConceptNotFoundError
                    cursor.execute(
                        """
                        INSERT INTO clasificaciones_cloud
                            (clasificador_id, concepto_id, modelo_servicio, confianza, observaciones)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING clasificacion_id
                        """,
                        (classifier_id, concept_id, model, confidence, observations),
                    )
                    classification_id = int(cursor.fetchone()["clasificacion_id"])
                connection.commit()
                return classification_id
            except errors.UniqueViolation as exc:
                connection.rollback()
                raise DuplicateClassificationError from exc
            except Exception:
                connection.rollback()
                raise

    def progress(self, classifier_id: int) -> dict[str, int]:
        with self.connection() as connection, connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT
                  (SELECT COUNT(DISTINCT concepto_id) FROM libro_concepto) AS total,
                  COUNT(*) AS clasificados
                FROM clasificaciones_cloud
                WHERE clasificador_id = %s
                """,
                (classifier_id,),
            )
            row = dict(cursor.fetchone())
        row["pendientes"] = max(int(row["total"]) - int(row["clasificados"]), 0)
        return {key: int(value) for key, value in row.items()}

    def statistics(self, classifier_id: int) -> dict[str, int]:
        result = {model: 0 for model in ("IaaS", "PaaS", "SaaS", "FaaS")}
        with self.connection() as connection, connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT modelo_servicio, COUNT(*) AS cantidad
                FROM clasificaciones_cloud
                WHERE clasificador_id = %s
                GROUP BY modelo_servicio
                """,
                (classifier_id,),
            )
            for row in cursor.fetchall():
                result[row["modelo_servicio"]] = int(row["cantidad"])
        return result

    def record_request(
        self,
        client_identifier: str,
        operation: str,
        duration_ms: int,
        successful: bool,
        fault_code: str | None,
    ) -> None:
        try:
            with self.connection() as connection, connection.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO clientes_servidos
                        (identificador_cliente, operacion, duracion_ms, exitoso, codigo_fault)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (client_identifier, operation, duration_ms, successful, fault_code),
                )
                connection.commit()
        except Exception:
            # La telemetria nunca debe ocultar la respuesta principal del servicio.
            pass

