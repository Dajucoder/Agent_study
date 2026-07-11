# LangChain 学习项目

> 🌐 **English version**: [index.en.md](/en/index/)
>
> 🧭 **导航** · [📚 学习路线](LEARNING_GUIDE.md) · [环境搭建](ENV_SETUP.md) · [目录结构](PROJECT_STRUCTURE.md)
>
> 🏷️ **类型**：文档导航中枢 · **适合**：所有读者 · **建议**：先读「如何浏览本文档」

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

## 🧭 如何浏览本文档

本站由 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 构建，提供三层导航：

- **左侧边栏**：按「快速上手 → 教程 → 进阶 → 参考」分组，可随时跳转任意章节。
- **右侧目录（On this page）**：每页自动根据标题生成，点击直达页内小节（标题旁的 `#` 也可锚定）。
- **底部上一页 / 下一页**：教程 01→06 已按顺序串联，顺着读即可。

此外，每篇文档**顶部**都带一条导航条（🏠 首页 / 📚 学习路线 / 上一章 / 下一章 / 相关文档），方便在 GitHub 或文档站间快速跳转。

**快速入口**：

| 我想… | 去这里 |
| --- | --- |
| 5 分钟跑通第一个 LLM 调用 | [环境搭建](ENV_SETUP.md) |
| 知道该按什么顺序学 | [学习路线](LEARNING_GUIDE.md) |
| 了解整个项目如何组织 | [目录结构](PROJECT_STRUCTURE.md) |
| 从「模型 / 提示词」开始 | [01 模型与提示词](01-models-and-prompts.md) |
| 搞懂怎么把链发布成服务 | [06 服务化与部署](06-langserve-and-deployment.md) |
| 遇到报错 | [常见问题](TROUBLESHOOTING.md) |
| 看不懂术语 | [术语表](GLOSSARY.md) |

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
