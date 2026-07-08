"""
Modul konfigurasi terpusat aplikasi.

Modul ini menerapkan prinsip 12-Factor App: seluruh konfigurasi diambil dari
environment variable (via file .env pada saat development), divalidasi
tipenya secara otomatis oleh Pydantic, dan diekspos sebagai satu objek
Settings yang bersifat singleton (di-cache) di seluruh aplikasi.

Jangan pernah mengakses os.environ secara langsung di layer lain -
selalu import get_settings() dari modul ini agar sumber konfigurasi
tetap tunggal (single source of truth).
"""

from enum import StrEnum
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(StrEnum):
    """Enumerasi environment yang didukung aplikasi."""

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class LogLevel(StrEnum):
    """Enumerasi level logging yang valid."""

    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class LLMProvider(StrEnum):
    """
    Enumerasi provider LLM yang didukung.

    MOCK       : implementasi tiruan, instan, tanpa dependency berat -
                 dipakai untuk unit test, CI, dan development tanpa GPU.
    HUGGINGFACE: model open-weight sungguhan via library transformers -
                 dipakai sebagai Base Model (Milestone 2) dan nanti
                 sebagai slot yang sama untuk Fine-tuned Model (Milestone 15).
    """

    MOCK = "mock"
    HUGGINGFACE = "huggingface"


class LLMDevice(StrEnum):
    """Enumerasi device target untuk inference model."""

    AUTO = "auto"
    CPU = "cpu"
    CUDA = "cuda"


class Settings(BaseSettings):
    """
    Representasi tervalidasi dari seluruh konfigurasi aplikasi.

    Setiap field di-load dari environment variable dengan nama yang sama
    (case-insensitive). Jika sebuah field wajib tidak ditemukan, atau
    tipenya tidak sesuai, Pydantic akan raise ValidationError saat
    aplikasi start (fail fast), bukan menyebabkan error tersembunyi
    di tengah runtime.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # abaikan variabel milestone mendatang yang belum dipakai
    )

    # --- Application ---------------------------------------------------
    app_name: str = Field(default="RAG Academic Chat", description="Nama aplikasi")
    app_env: Environment = Field(
        default=Environment.DEVELOPMENT, description="Environment aktif saat ini"
    )
    app_debug: bool = Field(default=True, description="Mode debug aplikasi")
    app_version: str = Field(default="0.1.0", description="Versi aplikasi")

    # --- Logging ---------------------------------------------------------
    log_level: LogLevel = Field(default=LogLevel.DEBUG, description="Level minimum log")
    log_dir: str = Field(default="logs", description="Direktori penyimpanan file log")
    log_rotation: str = Field(
        default="10 MB", description="Ukuran/interval rotasi file log (format Loguru)"
    )
    log_retention: str = Field(
        default="14 days", description="Durasi retensi file log lama (format Loguru)"
    )

    # --- LLM (Base Model / Fine-tuned Model - Milestone 2 & 15) ---------
    llm_provider: LLMProvider = Field(
        default=LLMProvider.MOCK,
        description=(
            "Provider LLM aktif. 'mock' untuk dev/test tanpa GPU, "
            "'huggingface' untuk model open-weight sungguhan."
        ),
    )
    llm_model_name: str = Field(
        default="Qwen/Qwen2.5-1.5B-Instruct",
        description=(
            "Nama/path model HuggingFace. Diisi model dasar pada Milestone 2, "
            "diganti path checkpoint hasil fine-tuning pada Milestone 15 - "
            "tanpa mengubah kode aplikasi, hanya variabel ini."
        ),
    )
    llm_max_new_tokens: int = Field(
        default=512, ge=1, le=8192, description="Jumlah maksimum token yang dihasilkan"
    )
    llm_temperature: float = Field(
        default=0.7, ge=0.0, le=2.0, description="Temperature sampling untuk generasi"
    )
    llm_top_p: float = Field(default=0.9, ge=0.0, le=1.0, description="Nucleus sampling top-p")
    llm_device: LLMDevice = Field(
        default=LLMDevice.AUTO, description="Device target inference model"
    )
    llm_quick_demo_mode: bool = Field(
        default=True,
        description=(
            "Jika true, HuggingFaceLLMClient akan fallback ke respons tiruan "
            "saat model gagal dimuat (mis. tanpa GPU/internet) alih-alih crash. "
            "WAJIB false di environment production."
        ),
    )

    @property
    def is_production(self) -> bool:
        """Helper untuk mengecek apakah aplikasi berjalan di production."""
        return self.app_env == Environment.PRODUCTION

    @property
    def is_development(self) -> bool:
        """Helper untuk mengecek apakah aplikasi berjalan di development."""
        return self.app_env == Environment.DEVELOPMENT


@lru_cache
def get_settings() -> Settings:
    """
    Mengembalikan instance Settings tunggal (singleton) yang di-cache.

    Menggunakan lru_cache agar file .env hanya dibaca & divalidasi sekali
    per proses, bukan setiap kali get_settings() dipanggil - penting untuk
    performa karena fungsi ini akan dipanggil sangat sering di seluruh layer
    (dependency injection di FastAPI pada Milestone 11, misalnya).
    """
    return Settings()
