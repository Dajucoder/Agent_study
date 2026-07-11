# 示例导航（Examples Index）

> 🌐 **English version**: [INDEX.en.md](INDEX.en.md)
>
> 🧭 **导航** · [🏠 项目首页](../README.md) · [文档站](../docs/index.md) · [改进计划](../IMPROVEMENT_PLAN.md)
>
> 🏷️ **类型**：示例入口 · **适合**：所有学习者

本目录包含 **14 个** 可运行示例（`00~11`，其中 `03` 有三套记忆实现），覆盖从环境验证到可观测性的完整学习路径。

> 运行方式：
> - 推荐：`make run-04`（等价于 `python examples/04_rag.py`）
> - 或：`python examples/04_rag.py`
> - 公共依赖在 `examples/_common/`（`get_llm` / `get_embeddings` / `format_docs` / `_safe_eval` 等），所有脚本统一 `from _common import ...`
> - **默认需要 `OPENAI_API_KEY`**（在 `.env` 配置）；`07_ollama_local.py` 走本地模型、`09_caching.py` 仅演示缓存，可零成本运行。

## 示例一览

| 脚本 | 主题 | 难度 | 时长 | 前置依赖 | 适合谁 |
| --- | --- | --- | --- | --- | --- |
| [00_check.py](00_check.py) | 环境验证：检查依赖与 API Key 是否就绪 | 入门 | ~1 min | 无（装好依赖即可） | 所有人（第一步） |
| [01_models_prompts.py](01_models_prompts.py) | 模型调用与提示词（含 `with_structured_output` 结构化输出） | 入门 | ~10 min | `OPENAI_API_KEY` | 新手 |
| [02_chains.py](02_chains.py) | 链（LCEL）：把提示词、模型、解析器拼成管道 | 入门 | ~15 min | `01` | 新手 |
| [03_memory.py](03_memory.py) | 记忆入口导航（推荐看 `03_memory_graph.py`） | 初级 | ~3 min | `02` | 想快速选对版本的人 |
| [03_memory_graph.py](03_memory_graph.py) | 记忆（**推荐**）：LangGraph `StateGraph` + `MemorySaver` | 中级 | ~20 min | `02` | 想学现代 API 的人 |
| [03_memory_runnable.py](03_memory_runnable.py) | 记忆（老 API 对照）：`RunnableWithMessageHistory`（已废弃） | 中级 | ~20 min | `02` | 维护老代码的人 |
| [04_rag.py](04_rag.py) | 检索与 RAG：Chroma 向量库 + 相似度检索 + 生成 | 中级 | ~30 min | `01` + `data/docs/sample.txt` | 想做私有知识问答的人 |
| [05_agents.py](05_agents.py) | 代理：工具调用（`calculator` + `get_current_time`）+ 安全计算 | 中级 | ~25 min | `02` | 想做自主任务的人 |
| [06_langserve.py](06_langserve.py) | 服务化：LangServe + CORS + `/health` 端点 | 进阶 | ~20 min | `04` | 想对外提供 API 的人 |
| [07_ollama_local.py](07_ollama_local.py) | 本地模型（Ollama，零成本、可离线） | 中级 | ~15 min | 装好 Ollama 本地服务 | 想省钱 / 离线的人 |
| [08_qwen.py](08_qwen.py) | 通义千问（DashScope 兼容模式） | 中级 | ~15 min | `DASHSCOPE_API_KEY` | 想用国产模型的人 |
| [09_caching.py](09_caching.py) | 缓存层：`InMemoryCache` / `SQLiteCache` 减少重复调用 | 初级 | ~10 min | `01` | 想控成本的人 |
| [10_rag_eval.py](10_rag_eval.py) | RAG 评估：自建上下文命中率 + 可选 RAGAS | 进阶 | ~15 min | `04` | 想量化 RAG 效果的人 |
| [11_observability.py](11_observability.py) | 可观测性：token 计数 + LangSmith + OpenTelemetry | 进阶 | ~15 min | `01` | 想排查 / 监控线上的人 |

## 推荐学习路径

```
00_check → 01_models_prompts → 02_chains → 03_memory_graph
        → 04_rag → 05_agents → 06_langserve
        ↘ 07 / 08（换模型）   09（缓存）   10（评估）   11（可观测）
```

- **零成本路线**：`00` → `07_ollama_local` → `09_caching`
- **生产落地路线**：`04_rag` → `10_rag_eval` → `06_langserve` → `11_observability`

## 公共模块 `_common/`

| 模块 | 职责 |
| --- | --- |
| `_common/env.py` | 环境变量读取（`get_env` / `require_env` / `check_api_key`） |
| `_common/llm.py` | `get_llm()` / `get_embeddings()` 工厂（读 `pydantic-settings`） |
| `_common/io.py` | `format_docs()` 把检索块拼成上下文 |
| `_common/calc.py` | `_safe_eval()` 基于 AST 白名单的安全计算器 |
| `_common/paths.py` | `project_root()` / `data_path()` 路径工具 |
| `_common/settings.py` | `Settings`（`pydantic-settings`）集中管理 `.env` |
