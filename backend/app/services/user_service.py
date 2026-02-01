from app.core.security import hash_password

ffake_users_db = {
    "admin@example.com": {
        "email": "admin@example.com",
        "hashed_password": "PASTE_ARGON2_HASH_HERE",
        "role": "admin",
    },
    "parent@example.com": {
        "email": "parent@example.com",
        "hashed_password": "PASTE_ARGON2_HASH_HERE",
        "role": "parent",
    },
    "student@example.com": {
        "email": "student@example.com",
        "hashed_password": "PASTE_ARGON2_HASH_HERE",
        "role": "student",
    },
}


def get_user(email: str):
    return fake_users_db.get(email)
