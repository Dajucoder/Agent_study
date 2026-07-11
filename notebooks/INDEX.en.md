# Notebooks Index

> 🌐 **中文版**: [INDEX.md](INDEX.md)
>
> 🧭 **Navigate** · [🏠 Project Home](../README.en.md) · [Examples](../examples/INDEX.en.md) · [Docs](../docs/index.md)
>
> 🏷️ **Type**: notebooks entry · **For**: readers who prefer interactive learning

`notebooks/` ships **7** Jupyter notebooks (numbered `0~6`), each mirroring an `examples/` script — ideal for running and tweaking parameters live.

> How to run:
> ```bash
> jupyter notebook notebooks/00_getting_started.ipynb
> # or just open the .ipynb in VS Code and run
> ```

## Notebooks at a glance

| Notebook | Topic | Level | Maps to | For |
| --- | --- | --- | --- | --- |
| [00_getting_started.ipynb](00_getting_started.ipynb) | Getting started: env, first LLM call, basics | Beginner | `00_check.py` | absolute beginners |
| [01_models_and_prompts.ipynb](01_models_and_prompts.ipynb) | Models & prompt engineering | Beginner | `01_models_prompts.py` | prompt tinkerers |
| [02_chains.ipynb](02_chains.ipynb) | Chains (LCEL) composition | Beginner | `02_chains.py` | pipeline builders |
| [03_memory.ipynb](03_memory.ipynb) | Memory (multi-turn context) | Intro | `03_memory_graph.py` | chatbot builders |
| [04_retrieval_and_rag.ipynb](04_retrieval_and_rag.ipynb) | Retrieval & RAG | Intermediate | `04_rag.py` | knowledge-base QA |
| [05_agents.ipynb](05_agents.ipynb) | Agents (tool calling) | Intermediate | `05_agents.py` | autonomous-task builders |
| [06_langserve_and_deployment.ipynb](06_langserve_and_deployment.ipynb) | Serving & deployment | Advanced | `06_langserve.py` | API deployers |

## Relationship with examples

- **Notebooks = teaching edition**: step-by-step with outputs and comments, great for learning.
- **Example scripts = production edition**: compact, with `main()` entry and self-check asserts, ready to run and reuse.
- Recommended: skim the matching notebook first, then return to `examples/` for the "productionized" version.

> Before committing, strip outputs with `nbstripout` to avoid diff noise: `nbstripout notebooks/*.ipynb`.
