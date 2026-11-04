from fastapi.testclient import TestClient

from src.main import app
from tests.test_main import delete_auth_post, get_token


def test_owasp1():
    with TestClient(app) as client:
        token = get_token(client)
        response = delete_auth_post(client, token=token, post_id=1)
        assert response.json() == {"FLAG": "1Mpers0nateM3"}


def test_owasp2():
    with TestClient(app) as client:
        token = get_token(client, username="admin", password="admin")
        assert token == "FLAG:K3y$ToTh3C4stl3"


def test_owasp4():
    with TestClient(app) as client:
        response = client.get("/posts?limit=999")
        assert response.status_code == 200
        assert response.json() == [
            {"id": 999, "user": "9x9", "content": "FLAG:T00ManyRecord5"}
        ]
