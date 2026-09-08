from __future__ import annotations

from xml.etree import ElementTree as ET

from defusedxml.ElementTree import fromstring

from db.repository import ConceptNotFoundError, DuplicateClassificationError
from .envelope import response
from .faults import SoapFault, invalid_request
from .namespaces import NS, SERVICE_NS, SOAP_ENV
from .security import authenticate

VALID_MODELS = {"IaaS", "PaaS", "SaaS", "FaaS"}
OPERATIONS = {
    "ObtenerConceptosPendientes",
    "RegistrarClasificacion",
    "ObtenerProgresoUsuario",
    "ObtenerEstadisticasPorModelo",
}


def _text(parent: ET.Element, name: str, required: bool = True) -> str | None:
    node = parent.find(f"{{{SERVICE_NS}}}{name}")
    value = (node.text or "").strip() if node is not None else ""
    if required and not value:
        raise invalid_request(f"Falta el campo obligatorio: {name}")
    return value or None


def _integer(parent: ET.Element, name: str) -> int:
    value = _text(parent, name)
    try:
        parsed = int(value)
    except (TypeError, ValueError) as exc:
        raise invalid_request(f"El campo {name} debe ser entero") from exc
    if parsed <= 0:
        raise invalid_request(f"El campo {name} debe ser mayor que cero")
    return parsed


def parse_request(xml_bytes: bytes) -> tuple[ET.Element, ET.Element, str]:
    if b"<!DOCTYPE" in xml_bytes.upper() or b"<!ENTITY" in xml_bytes.upper():
        raise invalid_request("DTD y entidades externas no estan permitidas")
    try:
        envelope = fromstring(xml_bytes)
    except ET.ParseError as exc:
        raise invalid_request("XML invalido") from exc
    if envelope.tag != f"{{{SOAP_ENV}}}Envelope":
        raise invalid_request("Se esperaba un SOAP Envelope 1.1")
    body = envelope.find("soapenv:Body", NS)
    if body is None or len(body) != 1:
        raise invalid_request("SOAP Body debe contener una sola operacion")
    request = body[0]
    operation = request.tag.rsplit("}", 1)[-1].removesuffix("Request")
    if operation not in OPERATIONS:
        raise SoapFault("Client.Operation", "Operacion SOAP no soportada", 400)
    return envelope, request, operation


def dispatch(xml_bytes: bytes, repository) -> tuple[bytes, str]:
    envelope, request, operation = parse_request(xml_bytes)
    authenticated_id = authenticate(envelope, repository)
    requested_id = _integer(request, "clasificadorId")
    if requested_id != authenticated_id:
        raise SoapFault("Client.Authorization", "No puede operar para otro clasificador", 403)

    if operation == "ObtenerConceptosPendientes":
        limit_text = _text(request, "limite", required=False)
        try:
            limit = int(limit_text) if limit_text else 10
        except ValueError as exc:
            raise invalid_request("El limite debe ser entero") from exc
        if not 1 <= limit <= 100:
            raise invalid_request("El limite debe estar entre 1 y 100")
        concepts = []
        for item in repository.pending_concepts(authenticated_id, limit):
            concepts.append({
                "conceptoId": item.get("conceptoId", item.get("concepto_id")),
                "nombre": item["nombre"],
                "definicion": item["definicion"],
            })
        return response(operation, {"conceptos": concepts}), operation

    if operation == "RegistrarClasificacion":
        concept_id = _integer(request, "conceptoId")
        model = _text(request, "modeloServicio")
        if model not in VALID_MODELS:
            raise SoapFault("Client.InvalidModel", "Modelo de servicio invalido", 400)
        confidence_text = _text(request, "confianza", required=False)
        confidence = None
        if confidence_text is not None:
            try:
                confidence = float(confidence_text)
            except ValueError as exc:
                raise invalid_request("La confianza debe ser numerica") from exc
            if not 0 <= confidence <= 1:
                raise invalid_request("La confianza debe estar entre 0 y 1")
        try:
            classification_id = repository.register_classification(
                authenticated_id,
                concept_id,
                model,
                confidence,
                _text(request, "observaciones", required=False),
            )
        except ConceptNotFoundError as exc:
            raise SoapFault("Client.ConceptNotFound", "Concepto inexistente", 404) from exc
        except DuplicateClassificationError as exc:
            raise SoapFault("Client.DuplicateClassification", "Clasificacion duplicada", 409) from exc
        return response(operation, {"clasificacionId": classification_id, "estado": "registrada"}), operation

    if operation == "ObtenerProgresoUsuario":
        return response(operation, repository.progress(authenticated_id)), operation

    return response(operation, {"estadisticas": repository.statistics(authenticated_id)}), operation
