from __future__ import annotations


class SoapFault(Exception):
    def __init__(self, code: str, message: str, http_status: int = 500):
        super().__init__(message)
        self.code = code
        self.message = message
        self.http_status = http_status


def invalid_request(message: str) -> SoapFault:
    return SoapFault("Client.Validation", message, 400)

