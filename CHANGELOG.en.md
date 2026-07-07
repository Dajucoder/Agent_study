# Changelog

> 🌐 **中文版**: [CHANGELOG.md](CHANGELOG.md)

All notable changes to this project are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and version numbers follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned
- Migrate `RunnableWithMessageHistory` to LangGraph
- `mkdocs` docs site custom theme
- `Dockerfile` best practices (e.g. multi-stage build cache)
- mypy / bandit added to CI

## [0.4.1] - 2026-07-07

### Changed
- All `docs/*.md` and `docs/*.en.md` (32 docs) get a language-switcher link at the top
- Top-level meta files (README / CHANGELOG / CONTRIBUTING / SECURITY) cross-link between ZH and EN
- `mkdocs.yml`: added `version/extra.social` and `content.action.edit`; excluded `*.en.md` from nav
- `README.md`: added "Recent Updates" section highlighting v0.3 / v0.4 features
- `.gitignore`: added `.codebuddy/` to prevent dev-tool scripts from being committed

## [0.4.0] - 2026-07-07

### Added
- **Bilingual docs**: `README.en.md`, `docs/*.en.md` (16 English versions)
- `mkdocs.yml`: bilingual navigation (中文 / English) + Material theme
- `examples/_common/` split into submodules: `llm.py`, `embeddings.py`, `io.py`, `calc.py`
- CI quality gates: mypy + bandit
- Polished `examples/*.py` docstrings (bilingual ZH/EN)

### Changed
- `examples/_common.py` (file) → `examples/_common/` (package with submodules)
- `Makefile` and `Makefile.ps1` updated for the new `_common/` package
- `requirements.txt` adds mypy / bandit as dev tools

## [0.3.0] - 2026-07-07

### Added
- `examples/07_ollama_local.py`: Ollama local model branch example (zero-cost, offline)
- `examples/08_qwen.py`: Qwen via DashScope compatible mode
- `.pre-commit-config.yaml` + `.yamllint.yml`: auto ruff + yaml lint before commit
- `Dockerfile`: multi-stage build, non-root user, switchable langserve / jupyter
- `.github/workflows/docker.yml`: tag-triggered multi-arch build, push to Docker Hub / GHCR
- `mkdocs.yml` + `docs/index.md`: Material theme docs site config
- `.github/workflows/mkdocs.yml`: auto build and deploy to GitHub Pages

### Docs
- `README.md`: tech stack adds Ollama / DashScope / Docker / mkdocs; tree synced; "Model Variants" section added
- `docs/05-agents.md`: "Never use eval" warning added to common pitfalls
- `docs/PROJECT_STRUCTURE.md`: examples tree includes 07 / 08; `data/` adds `chroma_ollama`

## [0.2.1] - 2026-07-07

### Added
- `LICENSE` (MIT), `CHANGELOG.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
- `pyproject.toml` (project metadata + ruff / pytest / coverage config)
- `MANIFEST.in`, `.editorconfig`, `.gitattributes`, `.dockerignore`
- `.github/CODEOWNERS`, `.github/dependabot.yml`, `.github/release-drafter.yml`, `.github/labeler.yml`, `.github/FUNDING.yml`
- `.github/ISSUE_TEMPLATE/{config,bug_report,feature_request,documentation}.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/release.yml`, `label.yml`, `stale.yml`
- `docs/COST_AND_LIMITS.md`, `docs/OBSERVABILITY.md`, `docs/TROUBLESHOOTING.md`, `docs/ARCHITECTURE.md`, `docs/REFERENCES.md`, `docs/GLOSSARY.md`

### Changed
- `README.md`: added badges, table of contents, advanced docs table, contribution entry, BibTeX citation

## [0.2.0] - 2026-07-07

### Added
- `examples/_common.py`: common utilities (env loading, LLM factory, `format_docs`, `_safe_eval`)
- `tests/`: 16 offline smoke tests (`test_prompts` / `test_format_docs` / `test_calculator`)
- `Makefile` + `Makefile.ps1`: cross-platform common commands
- `.github/workflows/ci.yml`: Python 3.10/3.11/3.12 matrix + ruff + pytest
- `requirements.lock`: pinned dependencies (matches actual `.venv`)
- `IMPROVEMENT_PLAN.md`: improvement plan & implementation log

### Changed
- 7 `examples/0x_*.py` scripts: removed boilerplate, unified `def main()` + `if __name__ == "__main__"` entry
- `04_rag.py`: vector store "load if exists", avoiding repeated embedding / billing
- `05_agents.py`: removed `eval`, replaced with AST-whitelist-based `_safe_eval`
- `06_langserve.py`: added CORS, `/health` endpoint, `reload` mode
- `03_memory.py`: removed `StrOutputParser` from the underlying chain, preserved `AIMessage` to write to history correctly; added assertion self-check
- `README.md` / `PROJECT_STRUCTURE.md`: directory tree and naming aligned with reality
- `.gitignore`: only ignores runtime directories; `data/docs/` is under version control

### Fixed
- langchain 1.x compatibility: `AgentExecutor` is moved out of `langchain.agents`; `05_agents.py` uses `try/except` to support 0.x/1.x
- Third-party OpenAI-compatible endpoint + non-OpenAI embedding: `04_rag.py` adds `try/except` for friendly errors

### Security
- Removed `eval()`, replaced with AST-whitelist safe calculator (12 test cases in `tests/test_calculator.py`)

## [0.1.0] - 2026-07-06

### Added
- Initial commit: LangChain learning project skeleton
- `README.md` / `requirements.txt` / `.env.example` / `.gitignore`
- `docs/`: 9 learning docs (`LEARNING_GUIDE` / `ENV_SETUP` / `PROJECT_STRUCTURE` / `01-models-and-prompts` / `02-chains` / `03-memory` / `04-retrieval-and-rag` / `05-agents` / `06-langserve-and-deployment`)
- `examples/00_check.py` ~ `06_langserve.py` 7 runnable scripts
- `notebooks/`: 7 Jupyter notebooks (0~6)
- `data/docs/sample.txt`: RAG practice sample document

[Unreleased]: https://github.com/Dajucoder/Agent_study/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/Dajucoder/Agent_study/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Dajucoder/Agent_study/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Dajucoder/Agent_study/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/Dajucoder/Agent_study/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Dajucoder/Agent_study/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Dajucoder/Agent_study/releases/tag/v0.1.0
