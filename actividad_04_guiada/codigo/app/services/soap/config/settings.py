from __future__ import annotations

import os
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Settings:
    app_host: str = field(default_factory=lambda: os.getenv("APP_HOST", "127.0.0.1"))
    app_port: int = field(default_factory=lambda: int(os.getenv("APP_PORT", "5001")))
    db_host: str = field(default_factory=lambda: os.getenv("DB_HOST", "127.0.0.1"))
    db_port: int = field(default_factory=lambda: int(os.getenv("DB_PORT", "5432")))
    db_name: str = field(default_factory=lambda: os.getenv("DB_NAME", "library"))
    db_user: str = field(default_factory=lambda: os.getenv("DB_USER", "library_soap"))
    db_password: str = field(default_factory=lambda: os.getenv("DB_PASSWORD", ""))
    db_min_connections: int = field(
        default_factory=lambda: int(os.getenv("DB_MIN_CONNECTIONS", "1"))
    )
    db_max_connections: int = field(
        default_factory=lambda: int(os.getenv("DB_MAX_CONNECTIONS", "5"))
    )
    soap_max_body_bytes: int = field(
        default_factory=lambda: int(os.getenv("SOAP_MAX_BODY_BYTES", "65536"))
    )
    public_soap_url: str = field(
        default_factory=lambda: os.getenv(
            "PUBLIC_SOAP_URL", "http://127.0.0.1:5001/soap"
        )
    )

    @property
    def database_dsn(self) -> str:
        return (
            f"host={self.db_host} port={self.db_port} dbname={self.db_name} "
            f"user={self.db_user} password={self.db_password}"
        )
