from tests.test_main import delete_auth_post, get_token, register_raffle


def test_owasp1(client):
    token = get_token(client)
    response = delete_auth_post(client, token=token, post_id=1)
    assert response.json() == {"FLAG": "1Mpers0nateM3"}


def test_owasp2(client):
    token = get_token(client, username="admin", password="admin")
    assert token == "FLAG:K3y$ToTh3C4stl3"


def test_owasp3(client):
    response = client.get("/profile/jan")
    assert response.status_code == 200
    assert response.json() == {
        "id": 3,
        "username": "jan",
        "email": "jan@example.com",
        "description": "Not sure what to write here...",
        "bsn": "FLAG:S3ns!tiveInf0",
    }


def test_owasp4(client):
    response = client.get("/posts?limit=999")
    assert response.status_code == 200
    assert response.json() == [
        {"id": 999, "username": "9x9", "content": "FLAG:T00ManyRecord5"}
    ]


def test_owasp6(client):
    token = get_token(client)
    for _ in range(1, 11):
        register_raffle(client, token=token)

    response = register_raffle(client, token=token, check_status=False)
    assert response.json() == "FLAG:4Bsolut3W!nne3R!"
