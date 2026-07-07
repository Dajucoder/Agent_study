# Directory Layout & Module Description

This file describes the purpose of every directory / file in the project, and what **you should create** during learning. The doc doesn't write code for you — it just says "what you should write".

## Top-level Files

| Path | Purpose |
| --- | --- |
| `README.md` / `README.en.md` | Project overview & quick start (ZH / EN) |
| `requirements.txt` | Dependency list (provided) |
| `requirements.lock` | Pinned dependency list (reproducible) |
| `.env.example` | Environment variable template (provided; copy to `.env`) |
| `.gitignore` | Ignore rules (provided) |
| `Makefile` / `Makefile.ps1` | Common commands (Linux/macOS / Windows PowerShell) |
| `Dockerfile` | Container image (multi-stage, non-root) |
| `mkdocs.yml` | Docs site config |

## `docs/` Learning Docs (provided, bilingual)

| File | Content |
| --- | --- |
| `LEARNING_GUIDE.md` / `LEARNING_GUIDE.en.md` | Learning roadmap & milestones |
| `ENV_SETUP.md` / `ENV_SETUP.en.md` | Environment setup steps |
| `PROJECT_STRUCTURE.md` / `PROJECT_STRUCTURE.en.md` | This file |
| `01-models-and-prompts.md` (+ `.en.md`) | Models & Prompts |
| `02-chains.md` (+ `.en.md`) | Chains |
| `03-memory.md` (+ `.en.md`) | Memory |
| `04-retrieval-and-rag.md` (+ `.en.md`) | Retrieval & RAG |
| `05-agents.md` (+ `.en.md`) | Agents |
| `06-langserve-and-deployment.md` (+ `.en.md`) | Service deployment |
| `ARCHITECTURE.md` (+ `.en.md`) | Architecture overview |
| `COST_AND_LIMITS.md` (+ `.en.md`) | Cost control & limits |
| `OBSERVABILITY.md` (+ `.en.md`) | Observability & LangSmith |
| `TROUBLESHOOTING.md` (+ `.en.md`) | FAQ & troubleshooting |
| `REFERENCES.md` (+ `.en.md`) | References & resources |
| `GLOSSARY.md` (+ `.en.md`) | Glossary |
| `index.md` / `index.en.md` | Docs site home |

## `notebooks/` (provided)

Place Jupyter notebooks by chapter, **for exploration and experimentation**:

```
notebooks/
├── 00_getting_started.ipynb
├── 01_models_and_prompts.ipynb
├── 02_chains.ipynb
├── 03_memory.ipynb
├── 04_retrieval_and_rag.ipynb
├── 05_agents.ipynb
└── 06_langserve_and_deployment.ipynb
```

Tip: code cells for implementation, Markdown cells for "what you understood" and "pitfalls you hit".

## `examples/` (provided)

Place **independently runnable scripts** that are more engineering-oriented than notebooks:

```
examples/
├── _common/                  # Common utilities: env loading, LLM factory, format_docs, _safe_eval
├── 00_check.py               # Lead script: environment check
├── 01_models_prompts.py      # Models & Prompts
├── 02_chains.py              # Chains (LCEL)
├── 03_memory.py              # Memory
├── 04_rag.py                 # Retrieval & RAG
├── 05_agents.py              # Agents
├── 06_langserve.py           # Serving (LangServe)
├── 07_ollama_local.py        # Local model (Ollama, zero-cost)
└── 08_qwen.py                # Qwen (DashScope compatible mode)
```

Each script should be runnable with `python examples/0x_xxx.py` after activating the venv.
`00_check.py` is the lead script — run it after every `.env` change to confirm the environment.
`07_ollama_local.py` and `08_qwen.py` are **model-variant examples** that don't affect the main 0~6 learning path.

## `data/` (partially generated at runtime)

- `data/docs/`: PDFs / Markdown / TXTs for RAG practice (**included in version control**).
- `data/chroma/`: Chroma persistence directory for OpenAI embeddings (ignored by `.gitignore`).
- `data/chroma_ollama/`: Chroma persistence directory for Ollama embeddings (ignored by `.gitignore`).

## `tests/` (provided)

- `test_prompts.py`: ChatPromptTemplate assembly
- `test_format_docs.py`: RAG `format_docs` behavior
- `test_calculator.py`: Safe calculator (covers `+ - * /` and parentheses)
- All run offline without an LLM.

## Naming Convention

- Chapter numbers `01~06` correspond one-to-one with `docs/`, for easy cross-reference.
- Notebooks lean toward exploration, scripts toward engineering — they complement each other and don't have to match exactly.
