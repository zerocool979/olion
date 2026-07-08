"""
Factory untuk membuat instance LLMClientPort berdasarkan konfigurasi aktif.

Ini adalah SATU-SATUNYA tempat di seluruh codebase yang boleh melakukan
percabangan "provider mana yang dipakai". Layer application/ (Milestone
10-11) tidak pernah tahu atau peduli apakah yang dipakai MockLLMClient
atau HuggingFaceLLMClient - ia hanya menerima objek yang mematuhi
LLMClientPort lewat dependency injection.

Di Milestone 15, integrasi Fine-tuned Model cukup dilakukan dengan
mengubah Settings.llm_model_name ke path checkpoint hasil fine-tuning -
fungsi factory ini tidak perlu diubah sama sekali.
"""

from functools import lru_cache

from src.application.ports.llm_client_port import LLMClientPort
from src.config.settings import LLMProvider, Settings, get_settings
from src.core.exceptions import ConfigurationError
from src.core.logging_config import get_logger
from src.infrastructure.llm.mock_llm_client import MockLLMClient

log = get_logger(__name__)


def create_llm_client(settings: Settings | None = None) -> LLMClientPort:
    """
    Membuat instance LLMClientPort sesuai Settings.llm_provider.

    Args:
        settings: instance Settings opsional untuk injeksi (mis. saat testing).
            Jika None, diambil dari get_settings().

    Returns:
        Implementasi LLMClientPort yang siap dipakai (MockLLMClient atau
        HuggingFaceLLMClient).

    Raises:
        ConfigurationError: jika nilai llm_provider tidak dikenali.
    """
    settings = settings or get_settings()

    match settings.llm_provider:
        case LLMProvider.MOCK:
            log.info("Menggunakan MockLLMClient (provider=mock)")
            return MockLLMClient()

        case LLMProvider.HUGGINGFACE:
            # Lazy import agar dependency torch/transformers tidak wajib
            # ada hanya untuk mengimpor factory ini.
            from src.infrastructure.llm.huggingface_llm_client import HuggingFaceLLMClient

            log.info(
                "Menggunakan HuggingFaceLLMClient (provider=huggingface, model={})",
                settings.llm_model_name,
            )
            return HuggingFaceLLMClient(
                model_name=settings.llm_model_name,
                max_new_tokens=settings.llm_max_new_tokens,
                temperature=settings.llm_temperature,
                top_p=settings.llm_top_p,
                device=settings.llm_device,
                quick_demo_mode=settings.llm_quick_demo_mode,
            )

        case _:
            raise ConfigurationError(
                f"LLM provider tidak dikenali: {settings.llm_provider}",
                details={"valid_providers": [p.value for p in LLMProvider]},
            )


@lru_cache
def get_llm_client() -> LLMClientPort:
    """
    Mengembalikan instance LLMClientPort singleton (di-cache).

    Model besar mahal untuk dimuat berulang kali - lru_cache memastikan
    hanya dimuat sekali per proses, lalu dipakai ulang di seluruh
    request (penting untuk performa di Milestone 11).
    """
    return create_llm_client()
