"""
Domain entity untuk merepresentasikan sebuah pesan dalam percakapan.

Entity ini SENGAJA tidak punya dependency eksternal apa pun (tidak tahu
tentang HuggingFace, FastAPI, atau vector DB) - murni struktur data +
validasi bisnis dasar, sesuai prinsip Clean Architecture bahwa domain
adalah layer paling dalam dan paling stabil.
"""

from enum import StrEnum

from pydantic import BaseModel, Field


class MessageRole(StrEnum):
    """Peran pengirim pesan dalam sebuah percakapan chat."""

    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage(BaseModel):
    """
    Representasi satu pesan dalam sebuah sesi chat.

    Digunakan sebagai unit dasar percakapan di seluruh sistem - baik saat
    dikirim ke LLM (Milestone 2), dirangkai dengan konteks retrieval
    (Milestone 10), maupun disimpan/diteruskan lewat REST API (Milestone 11).
    """

    role: MessageRole
    content: str = Field(min_length=1, description="Isi pesan, tidak boleh kosong")

    def to_prompt_dict(self) -> dict[str, str]:
        """
        Mengonversi entity ke dict format chat-template standar
        (role/content) yang dikonsumsi oleh tokenizer HuggingFace maupun
        format pesan API pada umumnya.
        """
        return {"role": self.role.value, "content": self.content}
