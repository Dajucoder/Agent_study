# LangChain 学习项目

> 一个系统学习 **LangChain** 框架的实战型项目。从 0 到 1 掌握 Model I/O、Chain、Memory、Retrieval、Agent、LangServe 六大主题。

!!! tip "快速开始"
    ```bash
    git clone https://github.com/Dajucoder/Agent_study.git
    cd Agent_study
    python -m venv .venv && source .venv/bin/activate
    pip install -r requirements.lock
    cp .env.example .env  # 填入 OPENAI_API_KEY
    python examples/00_check.py
    ```

## 项目亮点

- 📚 **完整路线**：6 个章节从入门到部署
- 🛠 **工程化**：CI、测试、Makefile、安全审计
- 🐍 **现代 API**：langchain 1.x + langchain-classic
- 🌏 **本地/国产**：Ollama、通义千问示例
- 🤝 **可参与**：Issue 模板、PR 模板、贡献指南齐全

## 章节目录

| # | 主题 | 文档 |
| - | --- | --- |
| 1 | 模型与提示词 | [01-models-and-prompts.md](01-models-and-prompts.md) |
| 2 | 链（LCEL） | [02-chains.md](02-chains.md) |
| 3 | 记忆 | [03-memory.md](03-memory.md) |
| 4 | 检索与 RAG | [04-retrieval-and-rag.md](04-retrieval-and-rag.md) |
| 5 | 代理 | [05-agents.md](05-agents.md) |
| 6 | 服务化与部署 | [06-langserve-and-deployment.md](06-langserve-and-deployment.md) |

## 更多资源

- 仓库首页：<https://github.com/Dajucoder/Agent_study>
- 更新日志：[CHANGELOG.md](https://github.com/Dajucoder/Agent_study/blob/main/CHANGELOG.md)
- 贡献指南：[CONTRIBUTING.md](https://github.com/Dajucoder/Agent_study/blob/main/CONTRIBUTING.md)
