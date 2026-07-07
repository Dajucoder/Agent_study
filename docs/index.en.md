# LangChain Learning Project

> 🌐 **中文版**: [index.md](index.md)

> A hands-on project for **systematically learning the LangChain framework**. From 0 to 1, master the six core topics: Model I/O, Chain, Memory, Retrieval, Agent, and LangServe.

!!! tip "Quick Start"
    ```bash
    git clone https://github.com/Dajucoder/Agent_study.git
    cd Agent_study
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.lock
    cp .env.example .env  # fill in OPENAI_API_KEY
    python examples/00_check.py
    ```

## Highlights

- 📚 **Complete path**: 6 chapters from basics to deployment
- 🛠 **Engineering**: CI, tests, Makefile, security audit
- 🐍 **Modern API**: langchain 1.x + langchain-classic
- 🌏 **Local / China-friendly**: Ollama, Qwen examples
- 🤝 **Open to contribution**: Issue / PR templates, contribution guide
- 🌍 **Bilingual docs**: 简体中文 + English (this site)

## Chapter Index

| # | Topic | Doc |
| - | --- | --- |
| 1 | Models & Prompts | [01-models-and-prompts.md](01-models-and-prompts.md) |
| 2 | Chains (LCEL) | [02-chains.md](02-chains.md) |
| 3 | Memory | [03-memory.md](03-memory.md) |
| 4 | Retrieval & RAG | [04-retrieval-and-rag.md](04-retrieval-and-rag.md) |
| 5 | Agents | [05-agents.md](05-agents.md) |
| 6 | Serving & Deployment | [06-langserve-and-deployment.md](06-langserve-and-deployment.md) |

## More Resources

- Repo homepage: <https://github.com/Dajucoder/Agent_study>
- Changelog: [CHANGELOG.md](https://github.com/Dajucoder/Agent_study/blob/main/CHANGELOG.md)
- Contributing: [CONTRIBUTING.md](https://github.com/Dajucoder/Agent_study/blob/main/CONTRIBUTING.md)
- Chinese docs: [docs/index.md](index.md)
