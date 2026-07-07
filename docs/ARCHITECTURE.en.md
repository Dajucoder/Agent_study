# Architecture Overview

> 🌐 **中文版**: [ARCHITECTURE.md](ARCHITECTURE.md)

> For readers who want a global view of the project. After reading, you should be able to draw a clear picture of the module relationships.

## 1. Design Goals

| Goal | Description |
| --- | --- |
| Learning-driven | Every concept has a corresponding `examples/0x_*.py` — what you see is what you learn. |
| Engineering | CI, tests, Makefile, security (no `eval`), reproducibility (`requirements.lock`). |
| Progressive | Chapters 01~06 are progressive, each building on the previous. |
| Extensible | Shared capabilities in `examples/_common/`, adding a new chapter just means adding one script. |

## 2. Module Relationships

```
┌────────────────────────────────────────────────────────────┐
│                       User                                  │
└──────┬──────────────────────────────────┬──────────────────┘
       │ docs                            │ code
       ▼                                  ▼
┌─────────────────┐               ┌─────────────────┐
│   docs/         │               │   examples/     │
│  learning docs  │               │  runnable scripts│
│  (16 ZH + 16 EN)│               │  (00~08 + common)│
└────────┬────────┘               └────────┬────────┘
         │                                │
         │   cross-reference              │ import
         └────────────┐       ┌───────────┘
                      ▼       ▼
                 ┌─────────────────────────┐
                 │  LangChain / 3rd-party   │
                 │  - langchain 1.x         │
                 │  - langchain-classic 0.x │
                 │  - openai / chroma ...   │
                 └────────────┬────────────┘
                              │ calls
                              ▼
                 ┌─────────────────────────┐
                 │  LLM Provider           │
                 │  OpenAI / 3rd / local   │
                 └─────────────────────────┘

Auxiliary systems:
  tests/    → pytest offline smoke tests
  .github/  → CI / Issue / PR / Release
  data/     → sample docs + Chroma persistence
  notebooks/→ interactive experiments
```

## 3. Data Flow: RAG as an Example

```
User question
   │
   ▼
[Retriever]      ←—————  Chroma vector store (data/chroma/)
   │  top-k chunks
   ▼
[format_docs]    ←—————  examples/_common/io/format_docs
   │  joined by "\n\n"
   ▼
[ChatPromptTemplate]   ←—————  RAG prompt template
   │  {context} + {question}
   ▼
[ChatOpenAI]      ←—————  .env OPENAI_API_KEY / MODEL
   │  AIMessage
   ▼
[StrOutputParser] ←—————  extracts content
   │
   ▼
User-visible answer
```

## 4. Key Design Decisions

### 4.1 Common utilities split into `examples/_common/`
The 9 example scripts share `check_api_key / get_llm / get_embeddings / data_path / format_docs / _safe_eval`, avoiding duplicated boilerplate.

### 4.2 Tests don't depend on a real LLM
The 16 tests in `tests/` cover:
- ChatPromptTemplate assembly (pure string)
- format_docs concatenation (pure logic)
- Safe calculator (pure AST parsing)

CI uses `OPENAI_API_KEY=dummy` placeholder and they all pass.

### 4.3 Locked dependencies & reproducibility
- `requirements.txt`: loose (`>=`) for learning.
- `requirements.lock`: strict (`==`) for CI / reproducibility.

### 4.4 Secure defaults
- `05_agents.py` doesn't use `eval`; uses an AST whitelist.
- `.env` is in `.gitignore`.
- `SECURITY.md` provides a "key leaked → rotate" flow.

## 5. Extension Points

| What to add | Where to change |
| --- | --- |
| New example | `examples/0x_xxx.py`, reuse `_common` as needed |
| New notebook | `notebooks/0x_xxx.ipynb` |
| New doc chapter | `docs/0x-xxx.md` (+ `.en.md`) and add to `README.md` directory tree |
| New tool | Add helper in `examples/_common/` |
| New CI task | `.github/workflows/*.yml` |
| New test | `tests/test_xxx.py` |

## 6. Future Roadmap

- [ ] Ollama / Qwen branch examples (✓ done in v0.3.0)
- [ ] LangGraph to replace `RunnableWithMessageHistory`
- [ ] `mkdocs` docs site (✓ done in v0.3.0)
- [ ] Dockerfile image (✓ done in v0.3.0)
