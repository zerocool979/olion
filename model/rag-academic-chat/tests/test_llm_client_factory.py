"""Unit test untuk src/infrastructure/llm/llm_client_factory.py."""

from src.config.settings import LLMProvider, Settings
from src.infrastructure.llm.llm_client_factory import create_llm_client
from src.infrastructure.llm.mock_llm_client import MockLLMClient


class TestCreateLLMClient:
    """Test suite untuk factory create_llm_client()."""

    def test_creates_mock_client_when_provider_is_mock(self) -> None:
        settings = Settings(llm_provider=LLMProvider.MOCK, _env_file=None)  # type: ignore[call-arg]

        client = create_llm_client(settings)

        assert isinstance(client, MockLLMClient)

    def test_creates_huggingface_client_when_provider_is_huggingface(self) -> None:
        """
        Model asli tidak diunduh di sandbox ini (tanpa akses HuggingFace Hub),
        namun quick_demo_mode=True memastikan HuggingFaceLLMClient tetap
        berhasil diinstansiasi lewat fallback demo, tanpa raise error -
        memvalidasi bahwa factory & lazy import bekerja dengan benar.
        """
        settings = Settings(
            llm_provider=LLMProvider.HUGGINGFACE,
            llm_model_name="model-tidak-ada/untuk-test",
            llm_quick_demo_mode=True,
            _env_file=None,  # type: ignore[call-arg]
        )

        client = create_llm_client(settings)

        assert client.health_check() is False  # dalam mode demo fallback

    def test_generate_works_end_to_end_with_mock_provider(self) -> None:
        from src.domain.entities import ChatMessage, MessageRole

        settings = Settings(llm_provider=LLMProvider.MOCK, _env_file=None)  # type: ignore[call-arg]
        client = create_llm_client(settings)

        response = client.generate([ChatMessage(role=MessageRole.USER, content="test end to end")])

        assert response.content != ""
        assert response.model_name == "mock-llm-v1"
