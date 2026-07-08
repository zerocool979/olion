"""Unit test untuk src/infrastructure/llm/mock_llm_client.py."""

from src.application.ports.llm_client_port import LLMClientPort
from src.domain.entities import ChatMessage, FinishReason, MessageRole
from src.infrastructure.llm.mock_llm_client import MockLLMClient


class TestMockLLMClientProtocolCompliance:
    """Memastikan MockLLMClient mematuhi kontrak LLMClientPort."""

    def test_mock_client_satisfies_llm_client_port(self) -> None:
        client = MockLLMClient()
        assert isinstance(client, LLMClientPort)


class TestMockLLMClientGenerate:
    """Test suite untuk method generate() pada MockLLMClient."""

    def test_generate_with_canned_response(self) -> None:
        client = MockLLMClient(canned_response="Jawaban tetap")
        messages = [ChatMessage(role=MessageRole.USER, content="Halo")]

        response = client.generate(messages)

        assert response.content == "Jawaban tetap"
        assert response.model_name == "mock-llm-v1"
        assert response.finish_reason == FinishReason.STOP

    def test_generate_echoes_last_user_message_by_default(self) -> None:
        client = MockLLMClient()
        messages = [
            ChatMessage(role=MessageRole.SYSTEM, content="system prompt"),
            ChatMessage(role=MessageRole.USER, content="Apa kabar?"),
        ]

        response = client.generate(messages)

        assert "Apa kabar?" in response.content

    def test_generate_computes_token_counts(self) -> None:
        client = MockLLMClient()
        messages = [ChatMessage(role=MessageRole.USER, content="satu dua tiga")]

        response = client.generate(messages)

        assert response.prompt_tokens == 3
        assert response.completion_tokens > 0

    def test_generate_latency_is_positive(self) -> None:
        client = MockLLMClient(simulated_latency_ms=10.0)
        messages = [ChatMessage(role=MessageRole.USER, content="test")]

        response = client.generate(messages)

        assert response.latency_ms >= 10.0


class TestMockLLMClientHealthCheck:
    """Test suite untuk method health_check() pada MockLLMClient."""

    def test_health_check_always_true(self) -> None:
        client = MockLLMClient()
        assert client.health_check() is True
