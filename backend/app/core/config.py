from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str
    environment: str
    secret_key: str
    access_token_expire_minutes: int

    class Config:
        env_file = ".env"


settings = Settings()
