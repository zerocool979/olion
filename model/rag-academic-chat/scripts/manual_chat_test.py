"""
Script manual test: validasi wiring end-to-end Base Model via CLI.

Menjalankan sesi chat sederhana (bukan RAG - retrieval baru masuk di
Milestone 10) untuk memverifikasi bahwa Settings -> factory -> LLM
client -> domain entities semuanya terhubung dengan benar.

Cara pakai:
    python scripts/manual_chat_test.py
    python scripts/manual_chat_test.py --turns "Halo!" "Siapa kamu?"
"""

import argparse
import sys
from pathlib import Path

# Memastikan root project ada di sys.path saat script dijalankan langsung.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.config.settings import get_settings  # noqa: E402
from src.core.logging_config import configure_logging, get_logger  # noqa: E402
from src.domain.entities import ChatMessage, MessageRole  # noqa: E402
from src.infrastructure.llm.llm_client_factory import create_llm_client  # noqa: E402

log = get_logger(__name__)

DEFAULT_TURNS = [
    "Halo, kamu siapa?",
    "Apa itu Retrieval-Augmented Generation?",
]

SYSTEM_PROMPT = (
    "Kamu adalah asisten AI akademik yang membantu mahasiswa memahami "
    "topik penelitian dengan jawaban yang ringkas dan akurat."
)


def run_chat_session(turns: list[str]) -> None:
    """Menjalankan sesi chat multi-turn dan mencetak hasilnya ke console."""
    settings = get_settings()
    configure_logging(settings)

    log.info(
        "Memulai manual chat test | provider={} | model={}",
        settings.llm_provider.value,
        settings.llm_model_name,
    )

    client = create_llm_client(settings)

    print(f"\n{'=' * 70}")
    print(f"  Provider : {settings.llm_provider.value}")
    print(f"  Model    : {settings.llm_model_name}")
    print(f"  Health   : {'OK' if client.health_check() else 'FALLBACK/DEMO MODE'}")
    print(f"{'=' * 70}\n")

    history: list[ChatMessage] = [ChatMessage(role=MessageRole.SYSTEM, content=SYSTEM_PROMPT)]

    for turn_number, user_text in enumerate(turns, start=1):
        history.append(ChatMessage(role=MessageRole.USER, content=user_text))

        response = client.generate(history)
        history.append(ChatMessage(role=MessageRole.ASSISTANT, content=response.content))

        print(f"[Turn {turn_number}] User      : {user_text}")
        print(f"[Turn {turn_number}] Assistant : {response.content}")
        print(
            f"           (tokens: prompt={response.prompt_tokens}, "
            f"completion={response.completion_tokens}, "
            f"latency={response.latency_ms:.2f}ms, "
            f"finish_reason={response.finish_reason.value})\n"
        )


def main() -> None:
    parser = argparse.ArgumentParser(description="Manual chat test untuk Base Model")
    parser.add_argument(
        "--turns",
        nargs="+",
        default=DEFAULT_TURNS,
        help="Daftar pesan user yang akan dikirim secara berurutan",
    )
    args = parser.parse_args()
    run_chat_session(args.turns)


if __name__ == "__main__":
    main()
