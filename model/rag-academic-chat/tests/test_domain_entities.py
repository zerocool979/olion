"""Unit test untuk src/domain/entities/."""

import pytest
from pydantic import ValidationError
from src.domain.entities import ChatMessage, FinishReason, LLMResponse, MessageRole


class TestChatMessage:
    """Test suite untuk entity ChatMessage."""

    def test_create_valid_message(self) -> None:
        message = ChatMessage(role=MessageRole.USER, content="Halo dunia")
        assert message.role == MessageRole.USER
        assert message.content == "Halo dunia"

    def test_empty_content_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            ChatMessage(role=MessageRole.USER, content="")

    def test_to_prompt_dict_format(self) -> None:
        message = ChatMessage(role=MessageRole.SYSTEM, content="Kamu asisten AI")
        result = message.to_prompt_dict()
        assert result == {"role": "system", "content": "Kamu asisten AI"}

    def test_invalid_role_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            ChatMessage(role="bukan_role_valid", content="test")  # type: ignore[arg-type]


class TestLLMResponse:
    """Test suite untuk entity LLMResponse."""

    def test_create_valid_response(self) -> None:
        response = LLMResponse(
            content="Ini jawaban",
            model_name="test-model",
            prompt_tokens=10,
            completion_tokens=5,
            latency_ms=123.4,
        )
        assert response.content == "Ini jawaban"
        assert response.finish_reason == FinishReason.STOP

    def test_total_tokens_property(self) -> None:
        response = LLMResponse(
            content="x",
            model_name="test-model",
            prompt_tokens=10,
            completion_tokens=7,
            latency_ms=1.0,
        )
        assert response.total_tokens == 17

    def test_negative_tokens_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            LLMResponse(
                content="x",
                model_name="test-model",
                prompt_tokens=-1,
                completion_tokens=5,
                latency_ms=1.0,
            )
