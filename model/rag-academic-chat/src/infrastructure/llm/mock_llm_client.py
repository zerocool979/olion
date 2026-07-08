"""
Implementasi tiruan (mock) dari LLMClientPort.

Tidak bergantung pada torch/transformers/GPU sama sekali - respons
dihasilkan instan dan deterministik. Dipakai untuk:
1. Unit test yang harus cepat (<1 detik) dan tidak butuh internet/GPU.
2. Development layer application/ (Milestone 10-11) tanpa perlu GPU lokal.
3. CI/CD pipeline (Milestone 16) tanpa biaya compute.

PENTING: kelas ini TIDAK BOLEH dipakai di environment production -
divalidasi lewat Settings.llm_provider yang harus "huggingface" di prod.
"""

import time

from src.domain.entities import ChatMessage, FinishReason, LLMResponse
from src.domain.entities.chat_message import MessageRole


class MockLLMClient:
    """
    Implementasi LLMClientPort yang mengembalikan respons tiruan.

    Mematuhi LLMClientPort secara struktural (Protocol) - tidak perlu
    mewarisi class apa pun, cukup punya method generate() dan
    health_check() dengan signature yang sesuai.
    """

    def __init__(self, canned_response: str | None = None, simulated_latency_ms: float = 5.0):
        """
        Args:
            canned_response: teks tetap yang selalu dikembalikan. Jika None,
                akan menghasilkan respons echo sederhana berdasarkan pesan
                terakhir user - berguna untuk memverifikasi wiring end-to-end.
            simulated_latency_ms: simulasi delay agar perilaku lebih mirip
                pemanggilan model sungguhan saat diuji di layer lain.
        """
        self._canned_response = canned_response
        self._simulated_latency_ms = simulated_latency_ms
        self._model_name = "mock-llm-v1"

    def generate(self, messages: list[ChatMessage]) -> LLMResponse:
        """Menghasilkan respons tiruan berdasarkan pesan terakhir dari user."""
        start = time.perf_counter()

        if self._canned_response is not None:
            content = self._canned_response
        else:
            last_user_message = next(
                (m for m in reversed(messages) if m.role == MessageRole.USER),
                None,
            )
            user_text = last_user_message.content if last_user_message else ""
            content = f"[MOCK RESPONSE] Anda mengatakan: {user_text}"

        elapsed_ms = (time.perf_counter() - start) * 1000 + self._simulated_latency_ms

        return LLMResponse(
            content=content,
            model_name=self._model_name,
            prompt_tokens=sum(len(m.content.split()) for m in messages),
            completion_tokens=len(content.split()),
            latency_ms=elapsed_ms,
            finish_reason=FinishReason.STOP,
        )

    def health_check(self) -> bool:
        """MockLLMClient selalu dianggap sehat - tidak ada resource eksternal."""
        return True
