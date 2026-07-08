"""
Kontrak abstrak untuk seluruh implementasi LLM client.

Ini adalah "sumbu" utama yang memungkinkan Base Model (Milestone 2)
digantikan oleh Fine-tuned Model (Milestone 15) tanpa mengubah kode
application/ atau domain/ sama sekali - selama implementasi konkret
mematuhi Protocol ini, ia bisa disuntikkan lewat factory tanpa friksi.

Menggunakan typing.Protocol (bukan abc.ABC) karena:
1. Structural typing - implementasi tidak perlu eksplisit mewarisi class
   ini, cukup punya method dengan signature yang sama (duck typing yang
   tetap type-safe berkat mypy).
2. Lebih mudah dipakai untuk testing - membuat stub/fake tanpa harus
   mewarisi hierarchy class tertentu.
"""

from typing import Protocol, runtime_checkable

from src.domain.entities import ChatMessage, LLMResponse


@runtime_checkable
class LLMClientPort(Protocol):
    """
    Kontrak yang harus dipenuhi oleh setiap implementasi LLM client,
    baik Base Model, Fine-tuned Model, maupun Mock untuk testing.
    """

    def generate(self, messages: list[ChatMessage]) -> LLMResponse:
        """
        Menghasilkan respons LLM berdasarkan riwayat pesan percakapan.

        Args:
            messages: daftar ChatMessage yang merepresentasikan riwayat
                percakapan, terurut dari paling lama ke paling baru.
                Elemen pertama boleh berupa pesan bertipe SYSTEM.

        Returns:
            LLMResponse berisi teks hasil generasi beserta metadata
            (jumlah token, latency, alasan berhenti).

        Raises:
            ModelLoadError: jika model gagal dimuat/diakses dan
                quick_demo_mode tidak aktif.
        """
        ...

    def health_check(self) -> bool:
        """
        Mengecek apakah LLM client siap menerima request.

        Dipakai oleh endpoint /health pada Milestone 11 (Backend API)
        untuk memverifikasi model benar-benar termuat sebelum menerima
        traffic produksi.
        """
        ...
