from functools import lru_cache

from bobverse.core.settings.app import AppSettings
from bobverse.core.settings.base import AppEnvTypes, BaseAppSettings
from bobverse.core.settings.development import DevAppSettings
from bobverse.core.settings.production import ProdAppSettings
from bobverse.core.settings.test import TestAppSettings

AppEnvType = DevAppSettings | TestAppSettings | ProdAppSettings

environments: dict[str, type[AppEnvType]] = {  # type: ignore
    AppEnvTypes.development: DevAppSettings,
    AppEnvTypes.testing: TestAppSettings,
    AppEnvTypes.production: ProdAppSettings,
}


@lru_cache
def get_app_settings() -> AppSettings:
    """
    Return application config.
    """
    app_env = BaseAppSettings().app_env
    config = environments[app_env]
    return config()  # type: ignore
