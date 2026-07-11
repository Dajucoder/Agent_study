# LangChain Learning Project

> 🌐 **中文版**: [README.md](README.md)
>
> 🧭 **Navigate** · [📖 Docs](docs/index.en.md) · [Changelog](CHANGELOG.en.md) · [Contributing](CONTRIBUTING.en.md) · [Security](SECURITY.en.md)
>
> 🏷️ **Type**: Project home · **For**: first-time visitors

> A hands-on project for **systematically learning the LangChain framework**. From 0 to 1, master the six core topics: Model I/O, Chain, Memory, Retrieval, Agent, and LangServe — with runnable examples, interactive notebooks, engineering-grade tests, and CI.

<!-- Badges: CI / License / Version / Language / Code style -->
[![CI](https://github.com/Dajucoder/Agent_study/actions/workflows/ci.yml/badge.svg)](https://github.com/Dajucoder/Agent_study/actions/workflows/ci.yml)
[![Release](https://github.com/Dajucoder/Agent_study/actions/workflows/release.yml/badge.svg)](https://github.com/Dajucoder/Agent_study/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue)](https://www.python.org)
[![Code style: ruff](https://img.shields.io/badge/code%20style-ruff-000000.svg)](https://docs.astral.sh/ruff/)
[![LangChain 1.x](https://img.shields.io/badge/langchain-1.x-1C3C3C)](https://python.langchain.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://www.conventionalcommits.org/)

[English](README.en.md) · [简体中文](README.md) · [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

## Table of Contents

- [Project Goals](#project-goals)
- [Who This Is For](#who-this-is-for)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Quick Start](#quick-start)
- [Offline Tests](#offline-tests)
- [Learning Path](#learning-path)
- [Example Code Notes](#example-code-notes)
- [Model Variants](#model-variants)
- [Notebook Notes](#notebook-notes)
- [Advanced Docs](#advanced-docs)
- [Contributing & Community](#contributing--community)
- [Online Learning Platform (Frontend)](#online-learning-platform-frontend)
- [Versioning & Releases](#versioning--releases)
- [License](#license)
- [Citation](#citation)

## Project Goals

- Build a 0-to-1 understanding of LangChain's design philosophy and core abstractions (Model I/O, Chain, Memory, Retrieval, Agent).
- Through modular, progressive exercises, learn to independently build LLM-based applications (RAG Q&A, intelligent agents).
- Develop engineering mindset: configuration management, observability (LangSmith), service deployment (LangServe).

## Who This Is For

- Python developers who want to get into LLM application development.
- People who have used ChatGPT/API and want to upgrade "calling an endpoint" to "building a system".
- Engineers who need to combine existing business with RAG and agents.

## Online Learning Platform (Frontend)

> 📖 Full docs: [docs/WEB_FRONTEND.en.md](docs/WEB_FRONTEND.en.md)

This repository also ships a **modern online learning platform frontend** (the `web/` folder, React 18 + TypeScript + Vite), tightly integrated with the LangChain learning path above, providing:

- **Course browsing & multi-dimensional classification**: 6 topics + level + video/article format filtering, search and sorting.
- **Content player**: HTML5 video (auto-resume) + article rich text (code with one-click copy, callouts, etc.).
- **Progress tracking & history**: per-course completion and watch progress, isolated per user and persisted.
- **Login / register & personal center**: route guards, account settings, learning overview.

It uses component-based development, Context-based state management, a mobile-first responsive layout and light/dark themes, with **zero third-party UI library** dependencies.

Local dev (requires Node.js 18+):

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build -> web/dist/
```

## Tech Stack

| Category | Selection |
| --- | --- |
| Language | Python 3.10+ |
| Core framework | LangChain (`langchain`, `langchain-openai`, `langchain-community`) |
| Vector store | Chroma (beginner-friendly; FAISS / Qdrant also work) |
| Embeddings | OpenAI `text-embedding-3-small` · Local Ollama (`nomic-embed-text`) |
| LLM providers | OpenAI · Qwen (DashScope) · Ollama (local) · Third-party OpenAI-compatible endpoints |
| Observability | LangSmith (optional) |
| Serving | LangServe + FastAPI (advanced) |
| Engineering | ruff · pytest · pre-commit · GitHub Actions · Docker · mkdocs |
| Interactive | Jupyter Notebook / JupyterLab |

## Repository Layout

```
Agent_study/
├── README.md / README.en.md    # This file (ZH / EN)
├── IMPROVEMENT_PLAN.md         # Improvement plan & changelog
├── CHANGELOG.md                # Version changelog
├── CONTRIBUTING.md             # Contribution guide
├── CODE_OF_CONDUCT.md          # Code of conduct
├── SECURITY.md                 # Security policy
├── LICENSE                     # MIT license
├── pyproject.toml              # Project metadata + ruff/pytest config
├── requirements.txt            # Dependencies (latest compatible)
├── requirements.lock           # Pinned dependencies (reproducible install)
├── .env.example                # Environment variable example
├── .editorconfig / .gitattributes / .dockerignore
├── .pre-commit-config.yaml     # Pre-commit auto-lint
├── Makefile                    # Common commands (Linux/macOS)
├── Makefile.ps1                # Common commands (Windows PowerShell)
├── Dockerfile                  # Container image (multi-stage, non-root)
├── mkdocs.yml                  # Docs site config (ZH + EN)
├── MANIFEST.in                 # Packaging file list
├── .github/
│   ├── workflows/              # CI: test / release / label / stale / docker / mkdocs
│   ├── ISSUE_TEMPLATE/         # bug / feature / docs templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── release-drafter.yml
│   ├── labeler.yml
│   └── FUNDING.yml
├── docs/                       # Learning docs (ZH + EN, 16 docs each side)
│   ├── LEARNING_GUIDE.md · ENV_SETUP.md · PROJECT_STRUCTURE.md
│   ├── 01-models-and-prompts.md ~ 06-langserve-and-deployment.md
│   ├── ARCHITECTURE.md · COST_AND_LIMITS.md · OBSERVABILITY.md
│   ├── TROUBLESHOOTING.md · REFERENCES.md · GLOSSARY.md
│   └── index.md
├── examples/                   # Runnable examples (00~08)
│   ├── _common/                # Common utilities (split into submodules)
│   ├── 00_check.py             # Environment check
│   ├── 01_models_prompts.py    # Models & prompts
│   ├── 02_chains.py            # Chains (LCEL)
│   ├── 03_memory.py            # Memory
│   ├── 04_rag.py               # Retrieval & RAG
│   ├── 05_agents.py            # Agents
│   ├── 06_langserve.py         # Service deployment
│   ├── 07_ollama_local.py      # Local model (Ollama)
│   └── 08_qwen.py              # Qwen (DashScope)
├── data/docs/sample.txt        # RAG sample document
├── tests/                      # Offline smoke tests
│   ├── conftest.py · test_prompts.py · test_format_docs.py · test_calculator.py
├── web/                        # React online learning platform frontend (see docs/WEB_FRONTEND.en.md)
│   ├── public/ · src/ (components / pages / store / data / utils / styles / types)
│   ├── index.html · vite.config.ts · tsconfig.json · package.json
│   └── README.md
└── notebooks/                  # Interactive notebooks (0~6)
```

## Quick Start

1. Read [docs/ENV_SETUP.md](docs/ENV_SETUP.md) to set up Python and the API key.
2. Read [docs/LEARNING_GUIDE.md](docs/LEARNING_GUIDE.md) for the recommended learning order.
3. After configuring `.env`, run the example scripts:

   **Option A: Direct `python` (all platforms)**
   ```bash
   python examples/00_check.py        # Verify environment
   python examples/01_models_prompts.py
   python examples/02_chains.py
   python examples/03_memory.py
   python examples/04_rag.py
   python examples/05_agents.py
   python examples/06_langserve.py    # Then visit http://localhost:8000/chain/playground
   ```

   **Option B: Makefile (Linux/macOS)**
   ```bash
   make help                # List all targets
   make check               # Run 00_check.py
   make run-04              # Run 04_rag.py
   make test                # Run pytest
   make lint                # Run ruff
   ```

   **Option C: Windows PowerShell**
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 help
   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 run-04
   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 test
   ```

4. Open `notebooks/00_getting_started.ipynb` in Jupyter and run cells one by one.
5. Read `docs/0x-*.md` for concepts, then try modifying the scripts in `examples/`.

## Offline Tests

`tests/` provides smoke tests that do **not** depend on a real LLM:

```bash
pytest tests/ -q          # 16 tests covering safe calculator, format_docs, ChatPromptTemplate
```

Or run them automatically through CI (`.github/workflows/ci.yml`, Python 3.10/3.11/3.12 matrix).

## Learning Path

1. **Models & Prompts (Model I/O)** — Call LLMs/ChatModels and manage prompt templates.
2. **Chains** — String multiple calls into a pipeline; understand LCEL expressions.
3. **Memory** — Give conversations context.
4. **Retrieval & RAG** — Document loading, splitting, vectorization, retrieval-augmented generation.
5. **Agents** — Let the LLM autonomously choose tools for complex tasks.
6. **Service & Deployment** — Use LangServe to expose chains as HTTP APIs.

## Example Code Notes

Each script in `examples/` corresponds to a chapter. They are all based on the LangChain 1.x modern API (`langchain-classic` provides 0.x-era Agent / Memory compatibility):

- The top of each script loads `.env` via `python-dotenv` (you need `OPENAI_API_KEY`).
- Default model is `gpt-4o-mini`; override via `.env`'s `OPENAI_MODEL` / `OPENAI_EMBEDDING_MODEL`.
- Shared capabilities (env loading, LLM factory, `format_docs`, safe calculator) live in `examples/_common/`.
- `04_rag.py` already supports "load if exists": first run creates `data/chroma`, subsequent runs reuse it.
- `06_langserve.py` includes CORS, `/health`, and `reload` (set `DEV=1` to enable).
- `07_ollama_local.py` / `08_qwen.py` are **model-variant examples**, independent of the main 0~6 path.

Recommended order: `00_check.py` first to set up, then 01→05 chapter by chapter, and finally 06 to publish your chain as a service. For zero-cost / offline / China-friendly models, try 07 and 08.

## Model Variants

| # | Name | Use case | Setup |
| --- | --- | --- | --- |
| 07 | Ollama (local) | Fully offline, zero token cost, learning / debugging | `ollama pull qwen2:7b` + `ollama pull nomic-embed-text` |
| 08 | Qwen (DashScope) | Fast in China, low cost, strong Chinese | Get an API key at [dashscope.aliyun.com](https://dashscope.aliyun.com/) |

> The two examples are independent of the main 0~6 path — use as needed.

## Notebook Notes

`notebooks/00_getting_started.ipynb` strings together the core flow with minimum code: env check → first model call → prompt template → LCEL chain. Each step includes Markdown commentary, making it ideal to run cell by cell in Jupyter and tweak parameters to see the effect.

## Advanced Docs

| Doc | Topic |
| --- | --- |
| [docs/LEARNING_GUIDE.md](docs/LEARNING_GUIDE.md) | Learning roadmap (with milestones) |
| [docs/ENV_SETUP.md](docs/ENV_SETUP.md) | Environment setup (venv, API key, Jupyter) |
| [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | Directory layout & module description |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture overview (data flow, modules, extension points) |
| [docs/COST_AND_LIMITS.md](docs/COST_AND_LIMITS.md) | Cost control, rate limits, context window |
| [docs/OBSERVABILITY.md](docs/OBSERVABILITY.md) | Observability: LangSmith intro & debug tips |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | FAQ & troubleshooting |
| [docs/REFERENCES.md](docs/REFERENCES.md) | References (official docs, tutorials, papers) |
| [docs/GLOSSARY.md](docs/GLOSSARY.md) | Glossary (LCEL, RAG, Agent, CORS…) |
| [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md) | This repo's improvement plan & changelog |
| [docs/05-agents.md](docs/05-agents.md) | Agents: includes "Never use eval" warning |

> 📖 Online docs site: <https://dajucoder.github.io/Agent_study/> (auto-built by mkdocs + GitHub Pages)

## Contributing & Community

- All forms of contribution are welcome: bug reports, doc improvements, new examples, PRs.
- See [CONTRIBUTING.md](CONTRIBUTING.md) for the full flow.
- See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for the code of conduct.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- For security issues, **report privately** — see [SECURITY.md](SECURITY.md).

## Recent Updates

### 🎉 v0.5.0 · Modern API + Quality Gates + Real Bilingual (2026-07-11)
- **Modern API**: `01` migrated to `with_structured_output`; `03` adds LangGraph version (`03_memory_graph.py`) + a legacy compare
- **New examples**: `09_caching` (cache), `10_rag_eval` (RAG eval), `11_observability` (token count + LangSmith + OTel)
- **Real bilingual mkdocs**: `mkdocs-static-i18n` auto-generates the `/en/` subsite + language switcher
- **Centralized config**: `pydantic-settings` for `.env`; `Dockerfile` adds `HEALTHCHECK`
- **Quality gates**: CI adds `windows-latest` to verify `Makefile.ps1`, `requirements.lock` resolvable check, coverage `fail_under=85` (measured 93%), tests 16 → 42
- **Navigation**: new `examples/INDEX.md` / `notebooks/INDEX.md` entry

## Versioning & Releases

- Current version: **v0.5.0** (2026-07-11)
- See [CHANGELOG.md](CHANGELOG.md) for history and changes
- Release drafts are auto-generated by [.github/release-drafter.yml](.github/release-drafter.yml)
- Auto-release flow: [.github/workflows/release.yml](.github/workflows/release.yml)
- Container image: when a tag is pushed, [.github/workflows/docker.yml](.github/workflows/docker.yml) builds and pushes to Docker Hub / GHCR
- Docs site: every push to main deploys to GitHub Pages via [.github/workflows/mkdocs.yml](.github/workflows/mkdocs.yml)

## License

This project's docs and code are released under the [MIT License](LICENSE) — for learning and non-commercial use.

## Citation

If this project helps your work / study, feel free to cite it:

```bibtex
@misc{agent_study_2026,
  author       = {Dajucoder},
  title        = {Agent\_study: A LangChain Learning Repository},
  year         = {2026},
  howpublished = {\url{https://github.com/Dajucoder/Agent_study}},
  note         = {Learning project: Model I/O / Chain / Memory / Retrieval / Agent / LangServe},
}
```

---

If you find this project useful, please give it a ⭐ to encourage the maintainer!

<!-- Reference links -->
[ci-shield]: https://github.com/Dajucoder/Agent_study/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/Dajucoder/Agent_study/actions/workflows/ci.yml
