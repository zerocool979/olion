"""
Domain entity untuk merepresentasikan hasil generasi dari LLM.

Sama seperti ChatMessage, entity ini murni struktur data tanpa dependency
eksternal - baik MockLLMClient maupun HuggingFaceLLMClient (dan nanti
implementasi Fine-tuned Model di Milestone 15) WAJIB mengembalikan objek
ini, sehingga layer application/ selalu bekerja dengan kontrak yang sama
tidak peduli implementasi konkret di baliknya.
"""

from enum import StrEnum

from pydantic import BaseModel, Field


class FinishReason(StrEnum):
    """Alasan berhentinya proses generasi token oleh LLM."""

    STOP = "stop"  # model berhenti secara alami (mis. token EOS)
    LENGTH = "length"  # mencapai batas max_new_tokens
    ERROR = "error"  # generasi gagal di tengah jalan


class LLMResponse(BaseModel):
    """Representasi hasil generasi satu kali panggilan LLM."""

    content: str = Field(description="Teks hasil generasi dari model")
    model_name: str = Field(description="Identifier model yang menghasilkan respons ini")
    prompt_tokens: int = Field(ge=0, description="Jumlah token pada prompt/input")
    completion_tokens: int = Field(ge=0, description="Jumlah token pada hasil generasi")
    latency_ms: float = Field(ge=0.0, description="Waktu proses generasi dalam milidetik")
    finish_reason: FinishReason = Field(default=FinishReason.STOP)

    @property
    def total_tokens(self) -> int:
        """Total token yang terpakai (prompt + completion) - berguna untuk cost tracking."""
        return self.prompt_tokens + self.completion_tokens
