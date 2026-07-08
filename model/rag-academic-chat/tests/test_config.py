"""Unit test untuk src/config/settings.py."""

import pytest
from pydantic import ValidationError
from src.config.settings import Environment, LogLevel, Settings, get_settings


class TestSettingsDefaults:
    """Test suite untuk nilai default Settings."""

    def test_default_app_name(self, test_settings: Settings) -> None:
        assert test_settings.app_name == "Test App"

    def test_default_environment_is_development(self) -> None:
        settings = Settings(_env_file=None)  # type: ignore[call-arg]
        assert settings.app_env == Environment.DEVELOPMENT

    def test_default_log_level_is_debug(self) -> None:
        settings = Settings(_env_file=None)  # type: ignore[call-arg]
        assert settings.log_level == LogLevel.DEBUG


class TestSettingsValidation:
    """Test suite untuk validasi tipe dan enum pada Settings."""

    def test_invalid_environment_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            Settings(app_env="not-a-real-environment", _env_file=None)  # type: ignore[call-arg]

    def test_invalid_log_level_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            Settings(log_level="NOT_A_LEVEL", _env_file=None)  # type: ignore[call-arg]

    def test_app_debug_accepts_boolean_string(self) -> None:
        settings = Settings(app_debug="true", _env_file=None)  # type: ignore[call-arg]
        assert settings.app_debug is True


class TestSettingsProperties:
    """Test suite untuk computed property helper di Settings."""

    def test_is_development_true_when_env_development(self) -> None:
        settings = Settings(app_env=Environment.DEVELOPMENT, _env_file=None)  # type: ignore[call-arg]
        assert settings.is_development is True
        assert settings.is_production is False

    def test_is_production_true_when_env_production(self) -> None:
        settings = Settings(app_env=Environment.PRODUCTION, _env_file=None)  # type: ignore[call-arg]
        assert settings.is_production is True
        assert settings.is_development is False


class TestGetSettingsSingleton:
    """Test suite untuk perilaku caching get_settings()."""

    def test_get_settings_returns_same_instance(self, clear_settings_cache: None) -> None:
        first_call = get_settings()
        second_call = get_settings()
        assert first_call is second_call
