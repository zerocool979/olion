"""
Exception hierarchy kustom untuk seluruh aplikasi.

Prinsip: setiap error domain-spesifik harus punya exception class sendiri
yang mewarisi AppBaseException, bukan menggunakan Exception generik atau
built-in exception (ValueError, KeyError, dst) secara langsung di layer
application/infrastructure.

Manfaat:
1. Pada Milestone 11 (Backend API), FastAPI exception handler bisa
   memetakan setiap subclass ke HTTP status code yang tepat secara
   otomatis, tanpa try/except bertumpuk di tiap endpoint.
2. Memberi konteks error yang jelas (error_code, detail) untuk logging
   dan debugging, alih-alih pesan generik "Something went wrong".
3. Membedakan error yang boleh ditampilkan ke user (mis. "dokumen tidak
   ditemukan") vs error internal yang harus disembunyikan dari user.
"""

from typing import Any


class AppBaseException(Exception):
    """
    Base exception untuk seluruh custom exception di aplikasi ini.

    Attributes:
        message: pesan error yang manusiawi dan aman ditampilkan ke user.
        error_code: kode unik mesin-terbaca untuk error ini, mis.
            "CONFIG_VALIDATION_ERROR". Berguna untuk logging, monitoring,
            dan pemetaan ke HTTP status code di Milestone 11.
        details: informasi tambahan terstruktur (opsional) untuk debugging,
            tidak selalu aman ditampilkan langsung ke end-user.
    """

    error_code: str = "APP_ERROR"

    def __init__(self, message: str, details: dict[str, Any] | None = None) -> None:
        self.message = message
        self.details = details or {}
        super().__init__(message)

    def __repr__(self) -> str:
        return (
            f"{self.__class__.__name__}(error_code={self.error_code!r}, message={self.message!r})"
        )


class ConfigurationError(AppBaseException):
    """Dilempar ketika konfigurasi aplikasi tidak valid atau tidak lengkap."""

    error_code = "CONFIGURATION_ERROR"


class NotFoundError(AppBaseException):
    """Dilempar ketika suatu resource (dokumen, chunk, sesi chat) tidak ditemukan."""

    error_code = "NOT_FOUND"


class ValidationError(AppBaseException):
    """Dilempar ketika input tidak memenuhi kontrak/skema yang diharapkan."""

    error_code = "VALIDATION_ERROR"


class ExternalServiceError(AppBaseException):
    """
    Dilempar ketika pemanggilan layanan eksternal gagal
    (mis. LLM API, Vector DB, embedding service pada milestone mendatang).
    """

    error_code = "EXTERNAL_SERVICE_ERROR"


class RetrievalError(AppBaseException):
    """Dilempar ketika proses retrieval pada RAG pipeline gagal (Milestone 8-10)."""

    error_code = "RETRIEVAL_ERROR"


class ModelLoadError(ExternalServiceError):
    """
    Dilempar ketika LLM (Base Model maupun Fine-tuned Model) gagal dimuat,
    misalnya karena bobot model tidak ditemukan, GPU/memori tidak cukup,
    atau tidak ada koneksi internet untuk mengunduh model dari HuggingFace Hub.
    """

    error_code = "MODEL_LOAD_ERROR"


class GenerationError(ExternalServiceError):
    """Dilempar ketika proses generasi teks oleh LLM gagal di tengah jalan."""

    error_code = "GENERATION_ERROR"
