SEEDED_POSTS = [
    {"id": 1, "username": "janine", "content": "hello world"},
    {"id": 2, "username": "bertrand", "content": "cool post"},
    {"id": 3, "username": "jan", "content": "very nice"},
]


def test_get_all_posts(client):
    response = client.get("/v2/posts")
    assert response.status_code == 200
    assert response.json() == SEEDED_POSTS


def test_create_anonymous_post(client):
    response = client.post("/v2/posts", json={"content": "hallo"})
    assert response.status_code == 201

    current_posts = client.get("/v2/posts")
    assert current_posts.json() == SEEDED_POSTS + [
        {"id": 4, "username": "anonymous", "content": "hallo"},
    ]


def get_token(client, username="johndoe", password="secret", full_response=False):
    response = client.post(
        "/v2/token",
        data={"username": username, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200

    if full_response:
        return response.json()
    return response.json()["access_token"]


def test_get_info(client):
    token = get_token(client)
    response = client.get("/v2/userinfo", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == {"username": "johndoe"}


def create_auth_post(client, token):
    response = client.post(
        "/v2/posts",
        json={"content": "hallo"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201

    current_posts = client.get("/v2/posts")
    assert current_posts.json() == SEEDED_POSTS + [
        {"id": 4, "username": "johndoe", "content": "hallo"},
    ]


def edit_auth_post(client, token, post_id):
    response = client.patch(
        f"/v2/posts/{post_id}",
        json={"content": "hallo edit"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200

    current_posts = client.get("/v2/posts")
    assert current_posts.json() == SEEDED_POSTS + [
        {"id": post_id, "username": "johndoe", "content": "hallo edit"},
    ]


def delete_auth_post(client, token, post_id):
    response = client.delete(
        f"/v2/posts/{post_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200

    if post_id == 4:
        current_posts = client.get("/v2/posts")
        assert current_posts.json() == SEEDED_POSTS

    return response


def test_create_edit_delete_auth_post(client):
    token = get_token(client)
    create_auth_post(client, token=token)
    edit_auth_post(client, token=token, post_id=4)
    delete_auth_post(client, token=token, post_id=4)


def test_get_all_raffle_registrations(client):
    response = client.get("/v2/raffle")
    assert response.status_code == 200
    assert response.json() == []


def register_raffle(client, token, check_status=True):
    response = client.post(
        "/v2/raffle",
        headers={"Authorization": f"Bearer {token}"},
    )

    if check_status:
        assert response.status_code == 201

    return response


def test_register_raffle(client):
    token = get_token(client)
    register_raffle(client, token=token)

    registrations = client.get("/v2/raffle")
    assert registrations.json() == [{"id": 1, "username": "johndoe"}]


def upload_photo(client, token, url):
    response = client.post(
        "/v2/upload_photo",
        json={"url": url},
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 201

    return response


def test_upload_photo(client):
    token = get_token(client)
    response = upload_photo(client, token=token, url="www.google.com")

    assert response.json() == {
        "status_code:": 200,
        "url": "www.google.com",
        "http_version": "HTTP/1.1",
    }
