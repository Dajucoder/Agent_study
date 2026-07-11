# 更新日志（Changelog）

> 🌐 **English version**: [CHANGELOG.en.md](CHANGELOG.en.md)
>
> 🧭 **导航** · [🏠 项目首页](README.md) · [改进计划](IMPROVEMENT_PLAN.md) · [贡献指南](CONTRIBUTING.md)
>
> 🏷️ **类型**：版本记录 · **适合**：想了解变更者

本项目所有值得注意的变更都记录在此文件。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本（Semantic Versioning）](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 计划中（v0.6.0 路线 · 见 IMPROVEMENT_PLAN P47~P52）
- LangGraph 完整示例（multi-agent / human-in-the-loop，P47）
- Notebook 回归测试（nbval + nbstripout，P48）
- OpenTelemetry 全面接入（P49）
- uv 替换 pip 自动生成锁文件（P50）
- 多向量库后端示例 FAISS / Qdrant / Milvus（P51）
- 流式 Web UI 演示（SSE 实时回显，P52）

## [1.0.0] - 2026-07-11 · 在线学习平台前端

### 新增
- 新增 `web/` 目录：基于 **React 18 + TypeScript + Vite** 的现代化在线学习平台前端（应用版本 v1.0.0）
- **课程展示与多维分类**：6 大主题 + 难度 + 视频/图文形式筛选，关键词搜索与多维排序，筛选状态同步到 URL
- **内容播放器**：HTML5 视频（自动续播）+ 图文富文本（代码一键复制、提示框），课时侧边栏展示完成状态
- **学习进度追踪与历史**：按课程记录完成度与观看秒数，按登录用户隔离并持久化于 `localStorage`，支持重置
- **用户登录注册及个人中心**：路由守卫保护学习/个人页，账户设置（昵称/简介/头像色），登录后回跳来源
- **规范状态管理**：`AuthContext` / `ProgressContext`（按用户分桶）/ `ThemeContext`，统一由 `AppProviders` 挂载
- **响应式与主题**：移动优先布局（PC/平板/手机断点）、浅色/深色双主题（CSS 变量）
- 配套文档 `docs/WEB_FRONTEND.md`（及 `.en.md`），并接入 `mkdocs.yml` 导航

## [0.5.0] - 2026-07-11

### 新增
- **现代 API**：`01_models_prompts.py` 迁 `with_structured_output`；`03_memory_graph.py`（LangGraph `StateGraph` + `MemorySaver`）+ 老 API 对照 `03_memory_runnable.py` + 入口导航 `03_memory.py`
- `examples/09_caching.py`：缓存层（`InMemoryCache` / `SQLiteCache`）
- `examples/10_rag_eval.py`：RAG 评估（自建上下文命中率 + 可选 RAGAS）
- `examples/11_observability.py`：可观测性（token 计数 + LangSmith + OpenTelemetry）
- `examples/INDEX.md` / `notebooks/INDEX.md`（含 `.en.md` 英文版）：示例与笔记本入口导航
- **mkdocs 真双语**：接入 `mkdocs-static-i18n`（suffix 模式，自动生成 `/en/` 子站 + 语言切换器）；32 篇文档内 `](X.en.md)` 链接统一改为 `/en/X/`
- **配置集中化**：引入 `pydantic-settings`（`examples/_common/settings.py` 集中管理 `.env`）
- **Docker 部署**：`Dockerfile` 加 `HEALTHCHECK`（探测 `/health`）+ 装 `curl`；`README` / `docs/06` 补 Docker 运行示例（含 `-v data/chroma` 挂载）
- 测试新增 `test_env` / `test_paths` / `test_io` / `test_04_rag` / `test_03_memory_logic` / `test_06_langserve` / `test_10_rag_eval` / `test_11_observability`，共 **42 用例**

### 变更
- `_common/llm.py` 加 `temperature / timeout / max_retries` 默认；`get_llm` / `get_embeddings` 透传 `openai_api_base`
- `docs/04-retrieval-and-rag.md` 补「进阶：评估」「进阶检索技术（Re-ranking / Hybrid Search）」
- `CONTRIBUTING.md` 增"提交 / 提 PR 前必跑 `make lint && make test`"指引
- CI：矩阵加 `windows-latest` 校验 `Makefile.ps1`；加 `requirements.lock` 可解析性校验（`--dry-run`）；coverage 源收敛 `examples/_common` 且 `fail_under=85`（实测 93%）
- `Makefile` / `Makefile.ps1` 增 `format` / `coverage` / `security` / `lock-check` 目标
- 依赖：`langgraph`、`pydantic-settings` 进 `requirements.txt` / `requirements.lock`

## [0.4.2] - 2026-07-11

### 变更（文档一致性热修）
- 修复 `docs/06-langserve-and-deployment.md` 练习任务文件名 `07_serve.py` → `06_langserve.py`
- `CHANGELOG.en.md` 移除不存在的 `embeddings.py` 子模块描述
- `docs/ARCHITECTURE.md` 第 6 节"后续路线"重构为"历史里程碑 + v0.5.0 候选路线"
- `.env.example` 补全 DASHSCOPE / OLLAMA 分支模型变量

## [0.4.1] - 2026-07-07

### 变更
- 全部 `docs/*.md` 与 `docs/*.en.md` 共 32 篇顶部加双语切换链接
- 顶层元文件（README / CHANGELOG / CONTRIBUTING / SECURITY）双语互相指向
- `mkdocs.yml` 加 `version/extra.social` 与 `content.action.edit`，把 `*.en.md` 排除 nav
- `README.md` 加 "最近更新" 段，突显 v0.3 / v0.4 新特性
- `.gitignore` 加 `.codebuddy/` 避免开发工具脚本被 commit

## [0.4.0] - 2026-07-07

### 新增
- **双语文档**：`README.en.md` 与 `docs/*.en.md`（16 篇英文版）
- `examples/_common.py` → `examples/_common/` 拆分子模块（`env` / `llm` / `io` / `calc` / `paths`）
- CI 质量门禁：mypy / bandit / coverage 70%

### 变更
- 7 个 `examples/0x_*.py` 沿用 `from _common import ...`（向后兼容）
- `requirements.txt` 标注可复现安装方式

## [0.3.0] - 2026-07-07

### 新增
- `examples/07_ollama_local.py`：Ollama 本地模型分支示例（零成本、离线）
- `examples/08_qwen.py`：通义千问 DashScope 兼容模式示例
- `.pre-commit-config.yaml` + `.yamllint.yml`：提交前自动 ruff + yaml lint
- `Dockerfile`：多阶段构建、non-root 用户、可切换 langserve / jupyter
- `.github/workflows/docker.yml`：tag 推送时多架构构建并推 Docker Hub / GHCR
- `mkdocs.yml` + `docs/index.md`：Material 主题文档站配置
- `.github/workflows/mkdocs.yml`：自动构建并部署到 GitHub Pages

### 文档
- `README.md`：技术栈加 Ollama / DashScope / Docker / mkdocs；目录树同步；新增"模型分支示例"小节
- `docs/05-agents.md`：常见坑补"绝不要 `eval`" 警示
- `docs/PROJECT_STRUCTURE.md`：examples 目录树加入 07 / 08；data/ 增加 `chroma_ollama`

## [0.2.1] - 2026-07-07

### 新增
- `LICENSE`（MIT）、`CHANGELOG.md`、`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`SECURITY.md`
- `pyproject.toml`（项目元数据 + ruff/pytest/coverage 配置）
- `MANIFEST.in`、`.editorconfig`、`.gitattributes`、`.dockerignore`
- `.github/CODEOWNERS`、`.github/dependabot.yml`、`.github/release-drafter.yml`、`.github/labeler.yml`、`.github/FUNDING.yml`
- `.github/ISSUE_TEMPLATE/{config,bug_report,feature_request,documentation}.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/workflows/release.yml`、`label.yml`、`stale.yml`
- `docs/COST_AND_LIMITS.md`、`docs/OBSERVABILITY.md`、`docs/TROUBLESHOOTING.md`、`docs/ARCHITECTURE.md`、`docs/REFERENCES.md`、`docs/GLOSSARY.md`

### 变更
- `README.md` 加徽章、目录、进阶文档表格、贡献入口、BibTeX 引用

## [0.2.0] - 2026-07-07

### 新增
- `examples/_common.py`：公共工具（环境变量、LLM 工厂、`format_docs`、`_safe_eval`）
- `tests/`：16 个离线 smoke 测试（`test_prompts` / `test_format_docs` / `test_calculator`）
- `Makefile` + `Makefile.ps1`：跨平台常用命令
- `.github/workflows/ci.yml`：Python 3.10/3.11/3.12 矩阵 + ruff + pytest
- `requirements.lock`：锁版本依赖（与 .venv 实际安装一致）
- `IMPROVEMENT_PLAN.md`：改进计划与实施日志

### 变更
- 7 个 `examples/0x_*.py` 去除样板代码，统一 `def main()` + `if __name__ == "__main__"` 入口
- `04_rag.py` 向量库"已存在则加载"，避免重复向量化与计费
- `05_agents.py` 移除 `eval`，改用基于 AST 白名单的 `_safe_eval`
- `06_langserve.py` 增加 CORS、`/health` 端点、`reload` 模式
- `03_memory.py` 底层链移除 `StrOutputParser`，保留 `AIMessage` 正确写入历史；增加断言自检
- `README.md` / `PROJECT_STRUCTURE.md` 目录树与命名与实际一致
- `.gitignore` 改为只忽略运行时目录，`data/docs/` 纳入版本控制

### 修复
- langchain 1.x 兼容性：`AgentExecutor` 已迁出 `langchain.agents`，`05_agents.py` 用 `try/except` 兼容 0.x/1.x
- 第三方 OpenAI 兼容端点 + 非 OpenAI embedding：`04_rag.py` 加 try/except 友好提示

### 安全
- 移除 `eval()`，替换为 AST 白名单安全计算器（`tests/test_calculator.py` 覆盖 12 个用例）

## [0.1.0] - 2026-07-06

### 新增
- 初次提交：LangChain 学习项目骨架
- `README.md` / `requirements.txt` / `.env.example` / `.gitignore`
- `docs/`：9 篇学习文档（`LEARNING_GUIDE` / `ENV_SETUP` / `PROJECT_STRUCTURE` / `01-models-and-prompts` / `02-chains` / `03-memory` / `04-retrieval-and-rag` / `05-agents` / `06-langserve-and-deployment`）
- `examples/00_check.py` ~ `06_langserve.py` 7 个可运行脚本
- `notebooks/`：7 个 Jupyter 笔记本（0~6）
- `data/docs/sample.txt`：RAG 练习示例文档

[Unreleased]: https://github.com/Dajucoder/Agent_study/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/Dajucoder/Agent_study/compare/v0.4.2...v0.5.0
[0.4.2]: https://github.com/Dajucoder/Agent_study/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/Dajucoder/Agent_study/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/Dajucoder/Agent_study/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Dajucoder/Agent_study/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/Dajucoder/Agent_study/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Dajucoder/Agent_study/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Dajucoder/Agent_study/releases/tag/v0.1.0
