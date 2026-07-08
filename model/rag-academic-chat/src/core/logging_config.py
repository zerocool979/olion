"""
Konfigurasi logging terstruktur untuk seluruh aplikasi.

Menggunakan Loguru karena:
1. API sederhana - tanpa boilerplate getLogger(__name__) di setiap file.
2. Rotasi & retensi file log built-in.
3. Mendukung structured/JSON logging secara native (berguna saat log
   dikirim ke aggregator seperti ELK/Datadog pada tahap deployment).
4. Traceback otomatis lebih informatif dibanding logging bawaan.

Modul ini HARUS dipanggil (configure_logging) sekali di titik masuk
aplikasi (entrypoint), sebelum modul lain melakukan logging.
"""

import sys
from pathlib import Path
from typing import TYPE_CHECKING

from loguru import logger

from src.config.settings import Settings, get_settings

if TYPE_CHECKING:
    from loguru import Logger as LoguruLogger


def configure_logging(settings: Settings | None = None) -> None:
    """
    Mengatur ulang seluruh sink (output) logger sesuai konfigurasi aplikasi.

    Args:
        settings: instance Settings opsional, berguna untuk injeksi saat
            testing. Jika None, akan diambil dari get_settings().
    """
    settings = settings or get_settings()

    # Hapus default sink bawaan Loguru agar tidak duplikat saat
    # configure_logging dipanggil lebih dari sekali (mis. di test suite).
    logger.remove()

    log_dir = Path(settings.log_dir)
    log_dir.mkdir(parents=True, exist_ok=True)

    # --- Sink 1: Console (human-readable, berwarna) --------------------
    logger.add(
        sys.stdout,
        level=settings.log_level.value,
        colorize=True,
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> "
            "- <level>{message}</level>"
        ),
        backtrace=settings.app_debug,
        diagnose=settings.app_debug,  # jangan tampilkan variabel lokal di production
    )

    # --- Sink 2: File terstruktur JSON (untuk log aggregator nantinya) ---
    logger.add(
        log_dir / "app.jsonl",
        level=settings.log_level.value,
        serialize=True,  # output JSON per baris
        rotation=settings.log_rotation,
        retention=settings.log_retention,
        compression="zip",
        backtrace=False,
        diagnose=False,  # jangan pernah dump variabel lokal ke file di production
        enqueue=True,  # thread-safe & async-safe write
    )

    # --- Sink 3: File khusus ERROR ke atas (memudahkan on-call debugging) ---
    logger.add(
        log_dir / "error.log",
        level="ERROR",
        rotation=settings.log_rotation,
        retention=settings.log_retention,
        compression="zip",
        enqueue=True,
    )

    logger.info(
        "Logging terkonfigurasi | env={env} | level={level} | debug={debug}",
        env=settings.app_env.value,
        level=settings.log_level.value,
        debug=settings.app_debug,
    )


def get_logger(name: str) -> "LoguruLogger":
    """
    Mengembalikan logger yang sudah di-bind dengan nama modul pemanggil.

    Contoh penggunaan di modul lain:
        from src.core.logging_config import get_logger
        log = get_logger(__name__)
        log.info("Pesan log")
    """
    return logger.bind(module=name)
