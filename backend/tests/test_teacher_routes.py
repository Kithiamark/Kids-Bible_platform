def test_teacher_can_access_admin_workspace_read_routes(client, db, teacher_headers):
    """Teacher-visible frontend routes should not hit auth failures."""
    checks = [
        client.get("/api/v1/users/me", headers=teacher_headers),
        client.get("/api/v1/users/", headers=teacher_headers),
        client.get("/api/v1/students/", headers=teacher_headers),
        client.get("/api/v1/lessons/", headers=teacher_headers),
        client.get("/api/v1/quizzes/", headers=teacher_headers),
        client.get("/api/v1/groups/", headers=teacher_headers),
    ]

    assert all(response.status_code == 200 for response in checks)


def test_teacher_can_read_user_detail_but_not_deactivate_users(client, test_user, teacher_headers):
    detail_response = client.get(f"/api/v1/users/{test_user.id}", headers=teacher_headers)
    delete_response = client.delete(f"/api/v1/users/{test_user.id}", headers=teacher_headers)

    assert detail_response.status_code == 200
    assert delete_response.status_code == 403
