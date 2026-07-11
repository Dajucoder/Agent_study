# Examples Index

> 🌐 **中文版**: [INDEX.md](INDEX.md)
>
> 🧭 **Navigate** · [🏠 Project Home](../README.en.md) · [Docs](../docs/index.md) · [Improvement Plan](../IMPROVEMENT_PLAN.md)
>
> 🏷️ **Type**: examples entry · **For**: all learners

This directory contains **14** runnable examples (`00~11`, with three memory implementations under `03`), covering the full learning path from environment verification to observability.

> How to run:
> - Recommended: `make run-04` (equivalent to `python examples/04_rag.py`)
> - Or: `python examples/04_rag.py`
> - Shared helpers live in `examples/_common/` (`get_llm` / `get_embeddings` / `format_docs` / `_safe_eval`); every script uses `from _common import ...`
> - **Needs `OPENAI_API_KEY` by default** (set in `.env`); `07_ollama_local.py` uses a local model and `09_caching.py` only demos caching, so both run at zero cost.

## Examples at a glance

| Script | Topic | Level | Time | Prereq | For |
| --- | --- | --- | --- | --- | --- |
| [00_check.py](00_check.py) | Env check: verify deps & API Key | Beginner | ~1 min | none (deps installed) | everyone (step 1) |
| [01_models_prompts.py](01_models_prompts.py) | Model calls & prompts (incl. `with_structured_output`) | Beginner | ~10 min | `OPENAI_API_KEY` | newbies |
| [02_chains.py](02_chains.py) | Chains (LCEL): compose prompt + model + parser | Beginner | ~15 min | `01` | newbies |
| [03_memory.py](03_memory.py) | Memory entry nav (see `03_memory_graph.py`) | Intro | ~3 min | `02` | those picking a version |
| [03_memory_graph.py](03_memory_graph.py) | Memory (**recommended**): LangGraph `StateGraph` + `MemorySaver` | Intermediate | ~20 min | `02` | modern-API learners |
| [03_memory_runnable.py](03_memory_runnable.py) | Memory (legacy compare): `RunnableWithMessageHistory` (deprecated) | Intermediate | ~20 min | `02` | maintaining old code |
| [04_rag.py](04_rag.py) | Retrieval & RAG: Chroma + similarity search + generation | Intermediate | ~30 min | `01` + `data/docs/sample.txt` | private-knowledge QA |
| [05_agents.py](05_agents.py) | Agents: tool calling (`calculator` + `get_current_time`) + safe eval | Intermediate | ~25 min | `02` | autonomous tasks |
| [06_langserve.py](06_langserve.py) | Serving: LangServe + CORS + `/health` | Advanced | ~20 min | `04` | exposing an API |
| [07_ollama_local.py](07_ollama_local.py) | Local model (Ollama, zero-cost, offline) | Intermediate | ~15 min | local Ollama running | cost-savers / offline |
| [08_qwen.py](08_qwen.py) | Qwen via DashScope compatible mode | Intermediate | ~15 min | `DASHSCOPE_API_KEY` | Chinese-model users |
| [09_caching.py](09_caching.py) | Cache layer: `InMemoryCache` / `SQLiteCache` | Intro | ~10 min | `01` | cost controllers |
| [10_rag_eval.py](10_rag_eval.py) | RAG eval: self-built context recall + optional RAGAS | Advanced | ~15 min | `04` | quantifying RAG quality |
| [11_observability.py](11_observability.py) | Observability: token count + LangSmith + OpenTelemetry | Advanced | ~15 min | `01` | debugging / monitoring |

## Suggested learning path

```
00_check → 01_models_prompts → 02_chains → 03_memory_graph
        → 04_rag → 05_agents → 06_langserve
        ↘ 07 / 08 (swap model)   09 (cache)   10 (eval)   11 (observability)
```

- **Zero-cost path**: `00` → `07_ollama_local` → `09_caching`
- **Production path**: `04_rag` → `10_rag_eval` → `06_langserve` → `11_observability`

## Shared module `_common/`

| Module | Responsibility |
| --- | --- |
| `_common/env.py` | env var reading (`get_env` / `require_env` / `check_api_key`) |
| `_common/llm.py` | `get_llm()` / `get_embeddings()` factories (read `pydantic-settings`) |
| `_common/io.py` | `format_docs()` joins retrieved chunks into context |
| `_common/calc.py` | `_safe_eval()` AST-whitelist safe calculator |
| `_common/paths.py` | `project_root()` / `data_path()` path helpers |
| `_common/settings.py` | `Settings` (`pydantic-settings`) centralizing `.env` |
