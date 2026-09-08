from __future__ import annotations

from xml.etree import ElementTree as ET

from .namespaces import SERVICE_NS, SOAP_ENV

ET.register_namespace("soapenv", SOAP_ENV)
ET.register_namespace("lib", SERVICE_NS)


def _element(parent: ET.Element, name: str, value: object | None = None) -> ET.Element:
    node = ET.SubElement(parent, f"{{{SERVICE_NS}}}{name}")
    if value is not None:
        node.text = str(value)
    return node


def response(operation: str, payload: dict[str, object]) -> bytes:
    envelope = ET.Element(f"{{{SOAP_ENV}}}Envelope")
    body = ET.SubElement(envelope, f"{{{SOAP_ENV}}}Body")
    root = _element(body, f"{operation}Response")
    _append_payload(root, payload)
    return ET.tostring(envelope, encoding="utf-8", xml_declaration=True)


def _append_payload(parent: ET.Element, payload: dict[str, object]) -> None:
    for key, value in payload.items():
        if isinstance(value, list):
            collection = _element(parent, key)
            for item in value:
                row = _element(collection, "item")
                _append_payload(row, item)
        elif isinstance(value, dict):
            child = _element(parent, key)
            _append_payload(child, value)
        else:
            _element(parent, key, value)


def fault(code: str, message: str) -> bytes:
    envelope = ET.Element(f"{{{SOAP_ENV}}}Envelope")
    body = ET.SubElement(envelope, f"{{{SOAP_ENV}}}Body")
    fault_node = ET.SubElement(body, f"{{{SOAP_ENV}}}Fault")
    ET.SubElement(fault_node, "faultcode").text = code
    ET.SubElement(fault_node, "faultstring").text = message
    return ET.tostring(envelope, encoding="utf-8", xml_declaration=True)

