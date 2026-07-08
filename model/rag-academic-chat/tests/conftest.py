"""Shared pytest fixtures untuk seluruh test suite."""

from collections.abc import Iterator

import pytest
from src.config.settings import Settings, get_settings


@pytest.fixture
def clear_settings_cache() -> Iterator[None]:
    """
    Membersihkan cache lru_cache dari get_settings() sebelum & sesudah test.

    Diperlukan karena get_settings() menggunakan @lru_cache (singleton),
    sehingga tanpa dibersihkan, test yang memanipulasi environment variable
    bisa saling mempengaruhi (test pollution) karena cache dari test
    sebelumnya masih terbawa.
    """
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture
def test_settings() -> Settings:
    """Mengembalikan instance Settings dengan nilai eksplisit untuk testing."""
    return Settings(
        app_name="Test App",
        app_env="development",
        app_debug=True,
        log_level="DEBUG",
        log_dir="test_logs",
    )
