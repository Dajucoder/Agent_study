# 更新日志（Changelog）

本项目所有值得注意的变更都记录在此文件。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [语义化版本（Semantic Versioning）](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 计划中
- `examples/07_ollama_local.py`：Ollama 本地模型分支示例
- `examples/08_qwen.py`：通义千问 + DashScope 示例
- `docs/COST_AND_LIMITS.md`：成本控制章节
- `docs/OBSERVABILITY.md`：LangSmith 追踪操作录屏/截图
- 引入 `pre-commit`（ruff + 提交前格式化）
- `pyproject.toml` 增加 `[project]` 元数据（待办）
- 引入 `mkdocs` 文档站点

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

[Unreleased]: https://github.com/Dajucoder/Agent_study/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Dajucoder/Agent_study/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Dajucoder/Agent_study/releases/tag/v0.1.0
