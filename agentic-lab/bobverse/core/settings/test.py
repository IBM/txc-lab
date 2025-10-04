import logging

from pydantic import computed_field
from sqlalchemy import NullPool

from bobverse.core.settings.app import AppSettings


class TestAppSettings(AppSettings):
    """
    Test application settings.
    """

    debug: bool = True

    title: str = "[TEST] bobverse API"

    logging_level: int = logging.WARNING

    class Config(AppSettings.Config):
        env_file = ".env.test"

    @computed_field  # type: ignore
    @property
    def sqlalchemy_engine_props(self) -> dict:
        return dict(
            url=self.sql_db_uri,
            echo=False,
            poolclass=NullPool,
            isolation_level="AUTOCOMMIT",
        )
