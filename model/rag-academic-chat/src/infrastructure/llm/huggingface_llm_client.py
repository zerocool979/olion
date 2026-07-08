"""
Implementasi LLMClientPort menggunakan model open-weight via HuggingFace
transformers.

Ini adalah Base Model sesungguhnya (Milestone 2). Slot yang SAMA PERSIS
akan dipakai untuk Fine-tuned Model di Milestone 15 - cukup ubah
Settings.llm_model_name dari nama model dasar (mis. "Qwen/Qwen2.5-7B-Instruct")
menjadi path checkpoint hasil fine-tuning (mis. "./models/finetuned-v1"),
tanpa mengubah kode apa pun di kelas ini maupun di layer atasnya.

DESAIN PENTING - Lazy Import:
torch dan transformers TIDAK diimpor di top-level file, melainkan di
dalam method _load_model(). Konsekuensinya, modul ini tetap bisa
di-import dan divalidasi strukturnya (mis. dicek kepatuhannya terhadap
LLMClientPort) bahkan di environment yang tidak punya kedua library
berat tersebut terpasang.

DESAIN PENTING - QUICK_DEMO_MODE:
Mengikuti pola yang sudah terbukti pada project riset Anda sebelumnya
(notebook Colab dengan QUICK_DEMO_MODE fallback): jika model gagal
dimuat (tidak ada GPU, tidak ada koneksi internet ke HuggingFace Hub,
dst) DAN quick_demo_mode=True, kelas ini fallback ke respons tiruan
alih-alih meng-crash seluruh aplikasi. Ini WAJIB dimatikan (False) di
environment production - divalidasi lewat method _load_model().
"""

import time
from typing import Any

from src.config.settings import LLMDevice
from src.core.exceptions import ModelLoadError
from src.core.logging_config import get_logger
from src.domain.entities import ChatMessage, FinishReason, LLMResponse

log = get_logger(__name__)


class HuggingFaceLLMClient:
    """
    Implementasi LLMClientPort menggunakan model causal LM dari HuggingFace.

    Mematuhi LLMClientPort secara struktural (Protocol) - lihat
    src/application/ports/llm_client_port.py untuk kontrak lengkap.
    """

    def __init__(
        self,
        model_name: str,
        max_new_tokens: int = 512,
        temperature: float = 0.7,
        top_p: float = 0.9,
        device: LLMDevice = LLMDevice.AUTO,
        quick_demo_mode: bool = True,
    ) -> None:
        """
        Args:
            model_name: nama model di HuggingFace Hub atau path lokal ke
                checkpoint (termasuk checkpoint hasil fine-tuning Milestone 15).
            max_new_tokens: batas maksimum token yang dihasilkan per generate().
            temperature: temperature sampling.
            top_p: nucleus sampling top-p.
            device: target device inference ("auto"/"cpu"/"cuda").
            quick_demo_mode: jika True, fallback ke respons tiruan saat model
                gagal dimuat, alih-alih raise ModelLoadError. WAJIB False
                di production.
        """
        self._model_name = model_name
        self._max_new_tokens = max_new_tokens
        self._temperature = temperature
        self._top_p = top_p
        self._device = device
        self._quick_demo_mode = quick_demo_mode

        self._model: Any = None
        self._tokenizer: Any = None
        self._is_demo_fallback: bool = False

        self._load_model()

    def _load_model(self) -> None:
        """
        Memuat model dan tokenizer dari HuggingFace Hub/path lokal.

        Import torch & transformers dilakukan di sini (lazy import), bukan
        di top-level modul, agar modul tetap bisa di-import di environment
        tanpa kedua library tersebut terpasang (mis. sandbox CI ringan).
        """
        try:
            import torch
            from transformers import AutoModelForCausalLM, AutoTokenizer

            log.info("Memuat model LLM: {}", self._model_name)
            resolved_device = (
                "cuda"
                if torch.cuda.is_available()
                else "cpu"
                if self._device == LLMDevice.AUTO
                else self._device.value
            )

            self._tokenizer = AutoTokenizer.from_pretrained(self._model_name)
            self._model = AutoModelForCausalLM.from_pretrained(
                self._model_name,
                torch_dtype=torch.float16 if resolved_device == "cuda" else torch.float32,
                device_map=resolved_device,
            )
            log.info("Model {} berhasil dimuat pada device={}", self._model_name, resolved_device)

        except Exception as exc:  # noqa: BLE001 - sengaja luas, lalu diklasifikasi ulang di bawah
            if self._quick_demo_mode:
                log.warning(
                    "Gagal memuat model '{}' ({}). QUICK_DEMO_MODE aktif -> "
                    "fallback ke respons tiruan. JANGAN gunakan mode ini di production.",
                    self._model_name,
                    str(exc),
                )
                self._is_demo_fallback = True
            else:
                log.error("Gagal memuat model '{}': {}", self._model_name, str(exc))
                raise ModelLoadError(
                    f"Gagal memuat model '{self._model_name}'",
                    details={"original_error": str(exc)},
                ) from exc

    def generate(self, messages: list[ChatMessage]) -> LLMResponse:
        """Menghasilkan respons dari model berdasarkan riwayat pesan."""
        start = time.perf_counter()

        if self._is_demo_fallback:
            return self._generate_demo_fallback(messages, start)

        try:
            chat_dicts = [m.to_prompt_dict() for m in messages]
            prompt_text = self._tokenizer.apply_chat_template(
                chat_dicts, tokenize=False, add_generation_prompt=True
            )
            inputs = self._tokenizer(prompt_text, return_tensors="pt").to(self._model.device)
            prompt_token_count = inputs["input_ids"].shape[-1]

            output_ids = self._model.generate(
                **inputs,
                max_new_tokens=self._max_new_tokens,
                temperature=self._temperature,
                top_p=self._top_p,
                do_sample=self._temperature > 0,
                pad_token_id=self._tokenizer.eos_token_id,
            )

            completion_ids = output_ids[0][prompt_token_count:]
            content = self._tokenizer.decode(completion_ids, skip_special_tokens=True)
            completion_token_count = len(completion_ids)

            finish_reason = (
                FinishReason.LENGTH
                if completion_token_count >= self._max_new_tokens
                else FinishReason.STOP
            )
            latency_ms = (time.perf_counter() - start) * 1000

            return LLMResponse(
                content=content.strip(),
                model_name=self._model_name,
                prompt_tokens=prompt_token_count,
                completion_tokens=completion_token_count,
                latency_ms=latency_ms,
                finish_reason=finish_reason,
            )
        except Exception as exc:  # noqa: BLE001
            log.error("Generasi gagal untuk model '{}': {}", self._model_name, str(exc))
            from src.core.exceptions import GenerationError

            raise GenerationError(
                "Proses generasi teks oleh LLM gagal", details={"original_error": str(exc)}
            ) from exc

    def _generate_demo_fallback(
        self, messages: list[ChatMessage], start_time: float
    ) -> LLMResponse:
        """Menghasilkan respons tiruan saat model gagal dimuat namun quick_demo_mode aktif."""
        from src.domain.entities.chat_message import MessageRole

        last_user_message = next(
            (m for m in reversed(messages) if m.role == MessageRole.USER), None
        )
        user_text = last_user_message.content if last_user_message else ""
        content = (
            f"[QUICK_DEMO_MODE - model '{self._model_name}' tidak tersedia di environment ini] "
            f"Pertanyaan Anda: {user_text}"
        )
        latency_ms = (time.perf_counter() - start_time) * 1000

        return LLMResponse(
            content=content,
            model_name=f"{self._model_name}(demo-fallback)",
            prompt_tokens=sum(len(m.content.split()) for m in messages),
            completion_tokens=len(content.split()),
            latency_ms=latency_ms,
            finish_reason=FinishReason.STOP,
        )

    def health_check(self) -> bool:
        """
        Mengecek kesiapan model.

        Mengembalikan False jika sedang dalam mode demo fallback -
        endpoint /health (Milestone 11) bisa memakai ini untuk memberi
        peringatan bahwa sistem berjalan tanpa model sungguhan.
        """
        return self._model is not None and not self._is_demo_fallback
