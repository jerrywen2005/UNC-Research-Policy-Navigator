from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app


def test_health_returns_ok():
    client = TestClient(create_app(Settings()))
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_cors_enabled_when_origins_configured():
    client = TestClient(create_app(Settings(cors_origins=["http://example.com"])))
    response = client.get("/api/health", headers={"Origin": "http://example.com"})
    assert response.headers["access-control-allow-origin"] == "http://example.com"
