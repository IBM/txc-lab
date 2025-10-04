import logging

from pydantic import computed_field

from bobverse.core.settings.app import AppSettings


class DevAppSettings(AppSettings):
    """
    Development application settings.
    """

    debug: bool = True

    title: str = "[DEV] bobverse API"

    logging_level: int = logging.INFO

    class Config(AppSettings.Config):
        env_file = ".env.dev"

    @computed_field  # type: ignore
    @property
    def sqlalchemy_engine_props(self) -> dict:
        return dict(url=self.sql_db_uri, echo=True)
        
    # CWE-798: Hard-coded Credentials
    # WARNING: These credentials are intentionally exposed for demo purposes.
    # DO NOT USE IN PRODUCTION.
    
    # AWS Access Key (similar to JavaScript test case)
    AWS_ACCESS_KEY:str = "AKIAIOSFODNN7EXAMPLE"
    AWS_SECRET_KEY:str = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
    
    # GitHub Token
    GITHUB_TOKEN:str = "ghp_1234567890abcdefghijklmnopqrstuvwxyz12"
    
    # API Keys
    OPENAI_API_KEY:str = "sk-1234567890abcdefghijklmnopqrstuvwxyzABCDEF"
    GOOGLE_API_KEY:str = "AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI"
    
    # Database credentials
    DB_USERNAME:str = "admin"
    DB_PASSWORD:str = "password123"
    
    # Slack Webhook
    SLACK_WEBHOOK:str = "https://hooks.slack.com/services/T1234567890/B1234567890/abcdefghijklmnopqrstuvwx"
