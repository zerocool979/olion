# RAG Academic Chat

AI Chat Akademik berbasis **Retrieval-Augmented Generation (RAG)** — dibangun secara
bertahap (incremental milestone) dengan prinsip Clean Architecture, SOLID, dan
production-ready engineering practice.

## Status Project

🟢 **Milestone 1 — Project Initialization** (selesai)

Lihat roadmap lengkap di `docs/roadmap.md` (akan ditambahkan seiring milestone berjalan).

## Arsitektur

Project mengikuti Clean Architecture dengan empat layer inti:

```
src/
├── domain/          # Entity bisnis murni, tanpa dependency eksternal
├── application/      # Use case / orkestrasi logic bisnis
├── infrastructure/   # Implementasi konkret (Vector DB, LLM, embedding, dst)
├── interfaces/        # REST API, entrypoint aplikasi
├── config/            # Configuration management (pydantic-settings)
└── core/               # Cross-cutting concern: logging, exception handling
```

## Prasyarat

- Python 3.11+
- [Poetry](https://python-poetry.org/docs/#installation)

## Instalasi

```bash
git clone <repository-url>
cd rag-academic-chat
cp .env.example .env
make install
```

## Perintah Developer

| Perintah | Deskripsi |
|---|---|
| `make lint` | Menjalankan linter (ruff) |
| `make format` | Auto-format kode |
| `make typecheck` | Menjalankan mypy static type checking |
| `make test` | Menjalankan seluruh unit test |
| `make test-cov` | Menjalankan test dengan laporan coverage HTML |
| `make run-check` | Menjalankan lint + typecheck + test sekaligus (quality gate) |

## Konfigurasi

Seluruh konfigurasi diatur lewat environment variable, lihat `.env.example`
untuk daftar lengkap dan penjelasannya. Konfigurasi divalidasi otomatis oleh
`src/config/settings.py` menggunakan Pydantic — aplikasi akan gagal start
dengan pesan error yang jelas jika ada konfigurasi wajib yang hilang/salah tipe.

## Lisensi

Internal academic research project.
