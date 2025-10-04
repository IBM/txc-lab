from pydantic import Extra, computed_field
from pydantic_settings import BaseSettings
from sqlalchemy import URL


class AppEnvTypes:
    """
    Available application environments.
    """

    production = "prod"
    development = "dev"
    testing = "test"


class BaseAppSettings(BaseSettings):
    """
    Base application setting class.
    """

    app_env: str = AppEnvTypes.production

    sqlite_db_path: str = "sqlite+aiosqlite:///bobverse.db"

    jwt_secret_key: str
    jwt_token_expiration_minutes: int = 60 * 24 * 7  # one week.
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"
        extra = Extra.ignore

    @computed_field  # type: ignore
    @property
    def sql_db_uri(self) -> URL:
        return URL.create(
            drivername="sqlite+aiosqlite",
            database=self.sqlite_db_path.replace("sqlite+aiosqlite:///", ""),
        )

    @computed_field  # type: ignore
    @property
    def sqlalchemy_engine_props(self) -> dict:
        return dict(url=self.sql_db_uri)
