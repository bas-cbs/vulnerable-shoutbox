def test_get_profile(client):
    response = client.get("/profiles/janine")
    assert response.status_code == 200
    assert response.json() == {
        "id": 1,
        "username": "janine",
        "description": "Thank for checking my profile!",
    }


def test_edit_profile(client):
    response = client.patch("/profiles/janine", json={"description": "hallo"})
    assert response.status_code == 200

    current_profile = client.get("/profiles/janine")
    assert current_profile.json() == {
        "id": 1,
        "username": "janine",
        "description": "hallo",
    }


def test_flag(client):
    response = client.patch("/profiles/janine", json={"description": "hallo"})
    assert response.status_code == 200
    assert response.json() == "FLAG:4lwaysTrustN3verV3rify"
