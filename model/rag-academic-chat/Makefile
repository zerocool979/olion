.PHONY: install lint format typecheck test test-cov clean run-check

install:
	poetry install
	poetry run pre-commit install

lint:
	poetry run ruff check src tests

format:
	poetry run ruff format src tests
	poetry run ruff check --fix src tests

typecheck:
	poetry run mypy src

test:
	poetry run pytest

test-cov:
	poetry run pytest --cov=src --cov-report=html

# Menjalankan seluruh quality gate sekaligus - dipakai sebagai
# checkpoint validasi di akhir setiap milestone.
run-check: lint typecheck test
	@echo "✅ Semua quality gate lulus."

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	rm -rf .pytest_cache .mypy_cache .ruff_cache htmlcov .coverage
