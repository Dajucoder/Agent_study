# Learning Guide

> 🌐 **中文版**: [LEARNING_GUIDE.md](LEARNING_GUIDE.md)
>
> 🧭 **Navigate** · [🏠 Home](/en/index/) · [ENV_SETUP](/en/ENV_SETUP/) · [01 Models & Prompts](/en/01-models-and-prompts/) · [PROJECT_STRUCTURE](/en/PROJECT_STRUCTURE/)
>
> 🏷️ **Level**: Beginner · **Time**: ~10 min · **Prereq**: [ENV_SETUP](/en/ENV_SETUP/)

This document gives the recommended LangChain learning order, the goal of each phase, and the time investment. Use it together with `docs/0x-*.md` chapters and the hands-on practice in `notebooks/` and `examples/`.

## Prerequisites

Before starting, make sure you have:

- Python 3.10+ basics (functions, classes, decorators, async fundamentals).
- Basic knowledge of what an LLM is and how to use an API (e.g. OpenAI) for "Q&A".
- Can create and use a Python virtual environment and read `requirements.txt`.

If any of the above is missing, brush up on Python and try one Chat Completions API call before moving on.

## Recommended Order

| Phase | Topic | Doc | Goal | Suggested Time |
| --- | --- | --- | --- | --- |
| 0 | Environment setup | [ENV_SETUP.md](ENV_SETUP.md) | First LLM call works | 0.5 day |
| 1 | Models & Prompts | [01-models-and-prompts.md](01-models-and-prompts.md) | PromptTemplate + ChatModel demo | 1 day |
| 2 | Chains | [02-chains.md](02-chains.md) | Multi-step pipeline via LCEL | 1 day |
| 3 | Memory | [03-memory.md](03-memory.md) | Multi-turn context-aware conversation | 1 day |
| 4 | Retrieval & RAG | [04-retrieval-and-rag.md](04-retrieval-and-rag.md) | Local-document Q&A | 2 days |
| 5 | Agents | [05-agents.md](05-agents.md) | Let the LLM call custom tools | 2 days |
| 6 | Serving & Deployment | [06-langserve-and-deployment.md](06-langserve-and-deployment.md) | Publish a chain as an HTTP API | 1 day |

## Learning Method

1. **Read doc → write code → run it → tweak params**: For each chapter, read the concept first, then create `0x_topic.ipynb` in `notebooks/` to implement it yourself; after it runs, tweak parameters to see the difference.
2. **Use LangSmith**: When going deeper, turn on `LANGCHAIN_TRACING_V2=true` to see every call's input / output / latency in the UI, building "observable" engineering intuition.
3. **Minimal-change experiments**: e.g. switch `gpt-4o-mini` to `gpt-4o` to compare effect and cost; switch Chroma to FAISS to understand abstraction's replaceability.
4. **Document pitfalls**: write down the issues you ran into in the notebook's Markdown cells — that's more valuable than code.

## Milestones (Self-check)

- [ ] Can call `ChatOpenAI` for a conversation
- [ ] Can use `PromptTemplate` to dynamically build prompts
- [ ] Can use LCEL (`|` pipe) to compose "prompt → model → parser" into a chain
- [ ] Can implement history-aware multi-turn dialog
- [ ] Can split / vectorize a PDF / Markdown and answer related questions (RAG)
- [ ] Can define tools and let an Agent autonomously choose to call them
- [ ] Can use LangServe to publish a chain as an API

Completing all milestones means you have the ability to independently develop LangChain applications.
