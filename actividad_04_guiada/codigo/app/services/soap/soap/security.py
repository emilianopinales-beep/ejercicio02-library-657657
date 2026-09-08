from __future__ import annotations

from xml.etree import ElementTree as ET

from .faults import SoapFault
from .namespaces import NS, WSSE_NS


def authenticate(envelope: ET.Element, repository) -> int:
    token = envelope.find(".//wsse:UsernameToken", NS)
    if token is None:
        raise SoapFault("Client.Authentication", "Falta el token WS-Security", 401)
    username_node = token.find(f"{{{WSSE_NS}}}Username")
    password_node = token.find(f"{{{WSSE_NS}}}Password")
    username = (username_node.text or "").strip() if username_node is not None else ""
    password = password_node.text or "" if password_node is not None else ""
    if not username or not password:
        raise SoapFault("Client.Authentication", "Credenciales incompletas", 401)
    classifier_id = repository.authenticate(username, password)
    if classifier_id is None:
        raise SoapFault("Client.Authentication", "Credenciales invalidas", 401)
    return classifier_id

