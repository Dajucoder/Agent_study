# LangChain 学习项目

> 🌐 **English version**: [README.en.md](README.en.md)

> 一个系统学习 **LangChain** 框架的实战型项目。从 0 到 1 掌握 Model I/O、Chain、Memory、Retrieval、Agent、LangServe 六大主题，配套可运行示例、交互式笔记本、工程化测试与 CI。

<!-- 徽章：CI / 协议 / 版本 / 语言 / 代码风格 -->
[![CI](https://github.com/Dajucoder/Agent_study/actions/workflows/ci.yml/badge.svg)](https://github.com/Dajucoder/Agent_study/actions/workflows/ci.yml)
[![Release](https://github.com/Dajucoder/Agent_study/actions/workflows/release.yml/badge.svg)](https://github.com/Dajucoder/Agent_study/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.10%20%7C%203.11%20%7C%203.12-blue)](https://www.python.org)
[![Code style: ruff](https://img.shields.io/badge/code%20style-ruff-000000.svg)](https://docs.astral.sh/ruff/)
[![LangChain 1.x](https://img.shields.io/badge/langchain-1.x-1C3C3C)](https://python.langchain.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-blue.svg)](https://www.conventionalcommits.org/)

[English](README.md) · [更新日志](CHANGELOG.md) · [贡献指南](CONTRIBUTING.md) · [安全策略](SECURITY.md)

## 目录

- [项目目标](#项目目标)
- [适合人群](#适合人群)
- [技术栈](#技术栈)
- [目录结构（实际）](#目录结构实际)
- [快速开始](#快速开始)
- [离线测试](#离线测试)
- [学习路线一览](#学习路线一览)
- [示例代码说明](#示例代码说明)
- [入门笔记本说明](#入门笔记本说明)
- [进阶文档](#进阶文档)
- [贡献与社区](#贡献与社区)
- [版本与发布](#版本与发布)
- [许可证](#许可证)
- [引用](#引用)

## 项目目标

- 从 0 到 1 理解 LangChain 的设计理念与核心抽象（Model I/O、Chain、Memory、Retrieval、Agent）。
- 通过分模块、循序渐进的练习，能够独立搭建一个基于 LLM 的应用（如 RAG 问答、智能代理）。
- 建立可复用的工程化认知：配置管理、可观测性（LangSmith）、服务化部署（LangServe）。

## 最近更新（Recent Updates）

### 🌐 v0.4.0 · 全面国际化（2026-07-07）
- **双语文档**：16 篇中文 + 16 篇英文（`README.en.md` + `docs/*.en.md`），每篇顶部都有语言切换链接
- **代码拆分**：`examples/_common.py` 拆为 `examples/_common/` 包（`env` / `llm` / `io` / `calc` / `paths`）
- **CI 增强**：加入 `mypy` 类型检查、`bandit` 安全扫描、`coverage` 70% 门槛

### 🚀 v0.3.0 · 多模型 + 部署（2026-07-07）
- **Ollama / Qwen**：零成本离线 / 国产低成本，详见 `examples/07_ollama_local.py` 和 `08_qwen.py`
- **Docker**：`Dockerfile`（多阶段 · non-root） + Docker Hub / GHCR 自动构建
- **mkdocs 文档站**：Material 主题，自动部署到 GitHub Pages
- **pre-commit**：提交前自动 ruff + yamllint

### 🛠 v0.2.x · 工程化（2026-07-07）
- 抽取 `_common.py`、补全测试、Makefile、CI、CHANGELOG、社区健康文件（CONTRIBUTING / CODE_OF_CONDUCT / SECURITY）
- 详情见 [CHANGELOG.md](CHANGELOG.md)

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
| 嵌入模型 | OpenAI `text-embedding-3-small` · 本地 Ollama（`nomic-embed-text`） |
| LLM 提供方 | OpenAI · 通义千问（DashScope） · Ollama 本地 · 第三方 OpenAI 兼容端点 |
| 可观测性 | LangSmith（可选） |
| 服务化 | LangServe + FastAPI（进阶） |
| 工程化 | ruff · pytest · pre-commit · GitHub Actions · Docker · mkdocs |
| 交互环境 | Jupyter Notebook / JupyterLab |

## 目录结构（实际）

```
Agent_study/
├── README.md                  # 本文件
├── IMPROVEMENT_PLAN.md        # 改进计划与实施日志
├── CHANGELOG.md               # 版本变更日志
├── CONTRIBUTING.md            # 贡献指南
├── CODE_OF_CONDUCT.md         # 行为准则
├── SECURITY.md                # 安全策略
├── LICENSE                    # MIT 许可证
├── pyproject.toml             # 项目元数据 + ruff/pytest 配置
├── requirements.txt           # 依赖清单（最新兼容版本）
├── requirements.lock          # 锁版本依赖（可复现安装）
├── .env.example               # 环境变量示例
├── .editorconfig / .gitattributes / .dockerignore
├── .pre-commit-config.yaml    # 提交前自动 lint
├── Makefile                   # 常用命令（Linux/macOS）
├── Makefile.ps1               # 常用命令（Windows PowerShell）
├── Dockerfile                 # 容器镜像（多阶段、non-root）
├── mkdocs.yml                 # 文档站配置
├── MANIFEST.in                # 打包文件清单
├── .github/
│   ├── workflows/             # CI：test / release / label / stale / docker / mkdocs
│   ├── ISSUE_TEMPLATE/        # bug / feature / docs 模板
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   ├── release-drafter.yml
│   ├── labeler.yml
│   └── FUNDING.yml
├── docs/                      # 学习文档（16 篇）
│   ├── LEARNING_GUIDE.md · ENV_SETUP.md · PROJECT_STRUCTURE.md
│   ├── 01-models-and-prompts.md ~ 06-langserve-and-deployment.md
│   ├── ARCHITECTURE.md · COST_AND_LIMITS.md · OBSERVABILITY.md
│   ├── TROUBLESHOOTING.md · REFERENCES.md · GLOSSARY.md
│   └── index.md
├── examples/                  # 可运行示例代码（00~08）
│   ├── _common.py             # 公共工具
│   ├── 00_check.py            # 环境验证
│   ├── 01_models_prompts.py   # 模型与提示词
│   ├── 02_chains.py           # 链（LCEL）
│   ├── 03_memory.py           # 记忆
│   ├── 04_rag.py              # 检索与 RAG
│   ├── 05_agents.py           # 代理
│   ├── 06_langserve.py        # 服务化
│   ├── 07_ollama_local.py     # 本地模型（Ollama）
│   └── 08_qwen.py             # 通义千问（DashScope）
├── data/docs/sample.txt       # RAG 示例文档
├── tests/                     # 离线 smoke 测试
│   ├── conftest.py · test_prompts.py · test_format_docs.py · test_calculator.py
└── notebooks/                 # 交互式笔记本（0~6）
    ├── 00_getting_started.ipynb
    ├── 01_models_and_prompts.ipynb
    ├── 02_chains.ipynb
    ├── 03_memory.ipynb
    ├── 04_retrieval_and_rag.ipynb
    ├── 05_agents.ipynb
    └── 06_langserve_and_deployment.ipynb
```

> `notebooks/` 已提供 **0~6 共 7 个交互式笔记本**（环境入门 → 部署），可按单元格逐步运行；`examples/` 已提供可直接运行的参考实现。

## 快速开始

1. 阅读 [docs/ENV_SETUP.md](docs/ENV_SETUP.md) 完成 Python 环境与 API Key 配置。
2. 阅读 [docs/LEARNING_GUIDE.md](docs/LEARNING_GUIDE.md) 了解推荐学习顺序。
3. 配置好 `.env` 后，直接运行示例脚本体验，例如：

   **方式 A：直接 `python`（所有平台）**
   ```bash
   python examples/00_check.py        # 验证环境
   python examples/01_models_prompts.py
   python examples/02_chains.py
   python examples/03_memory.py
   python examples/04_rag.py
   python examples/05_agents.py
   python examples/06_langserve.py    # 启动后访问 http://localhost:8000/chain/playground
   ```

   **方式 B：使用 Makefile（Linux/macOS）**
   ```bash
   make help                # 查看所有可用目标
   make check               # 跑 00_check.py
   make run-04              # 跑 04_rag.py
   make test                # 跑 pytest
   make lint                # 跑 ruff
   ```

   **方式 C：Windows PowerShell**
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 help
   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 run-04
   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 test
   ```

4. 打开 `notebooks/00_getting_started.ipynb`（Jupyter）按单元格运行，建立直观认识。
5. 按章节打开 `docs/0x-*.md` 阅读概念，再尝试改写 `examples/` 中的脚本。

## 离线测试

`tests/` 提供不依赖真实 LLM 的 smoke 测试，可用于：

```bash
pytest tests/ -q          # 16 个测试，覆盖安全计算器、format_docs、ChatPromptTemplate
```

或通过 CI 自动跑（`.github/workflows/ci.yml`，Python 3.10/3.11/3.12 矩阵）。

## 学习路线一览

1. **模型与提示词（Model I/O）** —— 调用 LLM、ChatModel，管理 Prompt 模板。
2. **链（Chains）** —— 把多次调用串成流水线，认识 LCEL 表达式。
3. **记忆（Memory）** —— 让对话拥有上下文。
4. **检索与 RAG** —— 文档加载、切分、向量化、检索增强生成。
5. **代理（Agents）** —— 让 LLM 自主选择工具完成复杂任务。
6. **服务化与部署** —— 用 LangServe 把链暴露为 API。

## 示例代码说明

`examples/` 下每个脚本对应一个学习章节，均基于 LangChain 1.x 现代 API（`langchain-classic` 提供 0.x 时期的 Agent / Memory 兼容）：

- 顶部统一通过 `python-dotenv` 加载 `.env` 配置（需先配置 `OPENAI_API_KEY`）。
- 模型默认 `gpt-4o-mini`，可通过 `.env` 的 `OPENAI_MODEL` / `OPENAI_EMBEDDING_MODEL` 覆盖。
- 公共能力（环境变量、LLM 工厂、`format_docs`、安全计算器）由 `examples/_common.py` 提供。
- `04_rag.py` 已支持"向量库已存在则加载"：首次运行会创建 `data/chroma`，再次运行直接复用。
- `06_langserve.py` 含 CORS、`/health`、`reload`（`DEV=1` 开启）；依赖已在 `requirements.txt` 中启用。
- `07_ollama_local.py` / `08_qwen.py` 属于**模型分支示例**，与主线 0~6 平行，按需使用。

建议运行顺序：先 `00_check.py` 打通环境，再按 01→05 逐章学习，最后用 06 把链发布为服务。
需要零成本/离线/国产模型时，再分别尝试 07、08。

## 模型分支示例

| 编号 | 名称 | 适用场景 | 准备 |
| --- | --- | --- | --- |
| 07 | Ollama 本地模型 | 完全离线、零 token 费用、学习/调试 | `ollama pull qwen2:7b` + `ollama pull nomic-embed-text` |
| 08 | 通义千问（DashScope） | 国内访问快、价格低、中文能力强 | 在 [dashscope.aliyun.com](https://dashscope.aliyun.com/) 申请 API Key |

> 本节的两个示例与主线 0~6 互不依赖，按需启用即可。

## 入门笔记本说明

`notebooks/00_getting_started.ipynb` 用最少代码串起核心流程：环境检查 → 第一个模型调用 → 提示词模板 → 用 LCEL 串成链。每个步骤都配有 Markdown 讲解，适合在 Jupyter 中逐个单元格运行、即时修改参数体会效果。

## 进阶文档

| 文档 | 主题 |
| --- | --- |
| [docs/LEARNING_GUIDE.md](docs/LEARNING_GUIDE.md) | 学习路线总纲（含里程碑） |
| [docs/ENV_SETUP.md](docs/ENV_SETUP.md) | 环境搭建（虚拟环境、API Key、Jupyter） |
| [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) | 目录结构与模块说明 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 架构总览（数据流、模块关系、扩展点） |
| [docs/COST_AND_LIMITS.md](docs/COST_AND_LIMITS.md) | 成本控制、速率限制、上下文窗口 |
| [docs/OBSERVABILITY.md](docs/OBSERVABILITY.md) | 可观测性：LangSmith 入门与 debug 技巧 |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | 常见问题与排查 |
| [docs/REFERENCES.md](docs/REFERENCES.md) | 参考资料（官方文档、教程、论文） |
| [docs/GLOSSARY.md](docs/GLOSSARY.md) | 术语表（LCEL、RAG、Agent、CORS…） |
| [IMPROVEMENT_PLAN.md](IMPROVEMENT_PLAN.md) | 本仓库的改进计划与实施日志 |
| [docs/05-agents.md](docs/05-agents.md) | 代理：含 "绝不要 eval" 警示 |
| [docs/05-agents.md#常见坑](docs/05-agents.md#常见坑) | 安全计算器替代 eval 的原因 |

> 📖 在线文档站：<https://dajucoder.github.io/Agent_study/>（由 mkdocs + GitHub Pages 自动构建）

## 许可证

本项目文档与示例代码采用 [MIT 许可证](LICENSE)，仅供学习交流使用。

## 贡献与社区

- 欢迎任何形式的贡献：bug 报告、文档改进、新示例、PR。
- 详细流程见 [CONTRIBUTING.md](CONTRIBUTING.md)。
- 行为准则见 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)。
- 安全问题请**私下**报告，见 [SECURITY.md](SECURITY.md)。

## 版本与发布

- 当前版本：**v0.4.0**（2026-07-07）
- 历史版本与变更见 [CHANGELOG.md](CHANGELOG.md)
- 发布草稿由 [.github/release-drafter.yml](.github/release-drafter.yml) 自动生成
- 自动发版流程见 [.github/workflows/release.yml](.github/workflows/release.yml)
- 容器镜像：推 tag 后由 [.github/workflows/docker.yml](.github/workflows/docker.yml) 自动构建并推 Docker Hub / GHCR
- 文档站：每次推 main 由 [.github/workflows/mkdocs.yml](.github/workflows/mkdocs.yml) 自动部署到 GitHub Pages

## 引用

如果本项目对你的工作/学习有帮助，欢迎在论文/博客中引用：

```bibtex
@misc{agent_study_2026,
  author       = {Dajucoder},
  title        = {Agent\_study: A LangChain Learning Repository},
  year         = {2026},
  howpublished = {\url{https://github.com/Dajucoder/Agent_study}},
  note         = {学习项目：Model I/O / Chain / Memory / Retrieval / Agent / LangServe},
}
```

---

如果觉得这个项目有用，请点亮 ⭐ 鼓励维护者持续更新！

<!-- 链接引用 -->
[ci-shield]: https://github.com/Dajucoder/Agent_study/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/Dajucoder/Agent_study/actions/workflows/ci.yml
