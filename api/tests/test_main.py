from fastapi.testclient import TestClient

from src.main import app

SEEDED_POSTS = [
    {"id": 1, "user": "janine", "content": "hello world"},
    {"id": 2, "user": "bertrand", "content": "cool post"},
    {"id": 3, "user": "jan", "content": "very nice"},
]


def test_get_all_posts():
    with TestClient(app) as client:
        response = client.get("/posts")
        assert response.status_code == 200
        assert response.json() == SEEDED_POSTS


def test_create_anonymous_post():
    with TestClient(app) as client:
        response = client.post("/post/create", json={"content": "hallo"})
        assert response.status_code == 201

        current_posts = client.get("/posts")
        assert current_posts.json() == SEEDED_POSTS + [
            {"id": 4, "user": "anonymous", "content": "hallo"},
        ]


def get_token(client):
    response = client.post(
        "/token",
        data={"username": "johndoe", "password": "secret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200

    return response.json()["access_token"]


def test_get_info():
    with TestClient(app) as client:
        token = get_token(client)
        response = client.get("/userinfo", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert response.json() == {
            "username": "johndoe",
            "email": "johndoe@example.com",
        }


def create_auth_post(client, token):
    response = client.post(
        "/post/create",
        json={"content": "hallo"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201

    current_posts = client.get("/posts")
    assert current_posts.json() == SEEDED_POSTS + [
        {"id": 4, "user": "johndoe", "content": "hallo"},
    ]


def edit_auth_post(client, token, post_id):
    response = client.patch(
        f"/post/{post_id}",
        json={"content": "hallo edit"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200

    current_posts = client.get("/posts")
    assert current_posts.json() == SEEDED_POSTS + [
        {"id": post_id, "user": "johndoe", "content": "hallo edit"},
    ]


def delete_auth_post(client, token, post_id):
    response = client.delete(
        f"/post/{post_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200

    if post_id == 4:
        current_posts = client.get("/posts")
        assert current_posts.json() == SEEDED_POSTS

    return response


def test_create_edit_delete_auth_post():
    with TestClient(app) as client:
        token = get_token(client)
        create_auth_post(client, token=token)
        edit_auth_post(client, token=token, post_id=4)
        delete_auth_post(client, token=token, post_id=4)
