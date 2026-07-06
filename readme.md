# LangChain 学习项目

一个系统学习 **LangChain** 框架的实战型项目。本仓库提供**学习路线、概念说明、环境配置、练习指引，以及一份可运行的示例代码集合和交互式入门笔记本**，帮助你边读文档、边动手把代码写出来，真正掌握 LangChain 的核心能力。

## 项目目标

- 从 0 到 1 理解 LangChain 的设计理念与核心抽象（Model I/O、Chain、Memory、Retrieval、Agent）。
- 通过分模块、循序渐进的练习，能够独立搭建一个基于 LLM 的应用（如 RAG 问答、智能代理）。
- 建立可复用的工程化认知：配置管理、可观测性（LangSmith）、服务化部署（LangServe）。

## 适合人群

- 已掌握 Python 基础，想入门 LLM 应用开发的开发者。
- 用过 ChatGPT/API，希望用框架把"调接口"升级为"搭系统"的人。
- 需要把已有业务与检索增强（RAG）、智能体（Agent）结合的工程师。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 语言 | Python 3.10+ |
| 核心框架 | LangChain（`langchain`、`langchain-openai`、`langchain-community`） |
| 向量库 | Chroma（入门友好，也可换 FAISS / Qdrant） |
| 嵌入模型 | OpenAI `text-embedding-3-small` 或本地模型 |
| 可观测性 | LangSmith（可选） |
| 服务化 | LangServe + FastAPI（进阶） |
| 交互环境 | Jupyter Notebook / JupyterLab |

## 目录结构（规划）

```
LangChain-Study/
├── README.md                  # 本文件
├── requirements.txt           # 依赖清单
├── .env.example               # 环境变量示例
├── .gitignore
├── docs/                      # 学习文档
│   ├── LEARNING_GUIDE.md      # 学习路线总纲
│   ├── ENV_SETUP.md           # 环境搭建步骤
│   ├── PROJECT_STRUCTURE.md   # 目录结构与各模块说明
│   ├── 01-models-and-prompts.md
│   ├── 02-chains.md
│   ├── 03-memory.md
│   ├── 04-retrieval-and-rag.md
│   ├── 05-agents.md
│   └── 06-langserve-and-deployment.md
├── examples/                  # 可运行示例代码（已提供，按章节命名）
│   ├── 00_check.py            # 环境验证
│   ├── 01_models_prompts.py   # 模型与提示词
│   ├── 02_chains.py           # 链（LCEL）
│   ├── 03_memory.py           # 记忆
│   ├── 04_rag.py              # 检索与 RAG
│   ├── 05_agents.py           # 代理（Agents）
│   ├── 06_langserve.py        # 服务化（LangServe）
│   └── data/docs/sample.txt   # RAG 练习用的示例文档
└── notebooks/                 # 交互式笔记本
    └── 00_getting_started.ipynb  # 入门笔记本（环境→模型→模板→链）
```

> `notebooks/` 中的 `00_getting_started.ipynb` 已提供，作为交互式入门笔记本，可按单元格逐步运行；你可继续在其中或新建笔记本练习。`examples/` 已提供可直接运行的参考实现。

## 快速开始

1. 阅读 [docs/ENV_SETUP.md](docs/ENV_SETUP.md) 完成 Python 环境与 API Key 配置。
2. 阅读 [docs/LEARNING_GUIDE.md](docs/LEARNING_GUIDE.md) 了解推荐学习顺序。
3. 配置好 `.env` 后，直接运行示例脚本体验，例如：
   ```bash
   python examples/00_check.py        # 验证环境
   python examples/01_models_prompts.py
   python examples/02_chains.py
   python examples/03_memory.py
   python examples/04_rag.py
   python examples/05_agents.py
   python examples/06_langserve.py    # 启动后访问 http://localhost:8000/chain/playground
   ```
4. 打开 `notebooks/00_getting_started.ipynb`（Jupyter）按单元格运行，建立直观认识。
5. 按章节打开 `docs/0x-*.md` 阅读概念，再尝试改写 `examples/` 中的脚本。

## 学习路线一览

1. **模型与提示词（Model I/O）** —— 调用 LLM、ChatModel，管理 Prompt 模板。
2. **链（Chains）** —— 把多次调用串成流水线，认识 LCEL 表达式。
3. **记忆（Memory）** —— 让对话拥有上下文。
4. **检索与 RAG** —— 文档加载、切分、向量化、检索增强生成。
5. **代理（Agents）** —— 让 LLM 自主选择工具完成复杂任务。
6. **服务化与部署** —— 用 LangServe 把链暴露为 API。

## 示例代码说明

`examples/` 下每个脚本对应一个学习章节，均基于 LangChain 0.2+ 现代 API：

- 顶部统一通过 `python-dotenv` 加载 `.env` 配置（需先配置 `OPENAI_API_KEY`）。
- 模型默认 `gpt-4o-mini`，可通过 `.env` 的 `OPENAI_MODEL` / `OPENAI_EMBEDDING_MODEL` 覆盖。
- `04_rag.py` 首次运行会自动创建 `data/chroma` 向量库；`06_langserve.py` 需先安装 `langserve/fastapi/uvicorn`（已在 `requirements.txt` 中启用）。

建议运行顺序：先 `00_check.py` 打通环境，再按 01→05 逐章学习，最后用 06 把链发布为服务。

## 入门笔记本说明

`notebooks/00_getting_started.ipynb` 用最少代码串起核心流程：环境检查 → 第一个模型调用 → 提示词模板 → 用 LCEL 串成链。每个步骤都配有 Markdown 讲解，适合在 Jupyter 中逐个单元格运行、即时修改参数体会效果。

## 许可证

本项目文档与示例代码采用 MIT 许可证，仅供学习交流使用。
