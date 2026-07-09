from pydantic import ConfigDict, model_validator
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    app_name: str = "Kids Delight Learning Platform"
    environment: str = "development"
    debug: bool = False
    api_version: str = "v1"
    
    # Security
    secret_key: str = "dev-only-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # Database
    database_url: str = "sqlite:///./app.db"
    
    # Azure Storage (for media files)
    azure_storage_account_name: Optional[str] = None
    azure_storage_account_key: Optional[str] = None
    azure_storage_container_name: Optional[str] = "media"
    
    # CORS - include both localhost and 127.0.0.1 (browsers treat as different origins)
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    allowed_hosts: str = "localhost,127.0.0.1"
    
    # Pagination
    default_page_size: int = 20
    max_page_size: int = 100

    model_config = ConfigDict(env_file=".env")

    @model_validator(mode="after")
    def validate_production_settings(self):
        """Prevent accidental production boot with local development defaults."""
        if self.environment == "production":
            if self.secret_key == "dev-only-change-me" or len(self.secret_key) < 32:
                raise ValueError("SECRET_KEY must be set to a strong value in production")
            if self.database_url == "sqlite:///./app.db":
                raise ValueError("DATABASE_URL must be set in production")
        return self


settings = Settings()
