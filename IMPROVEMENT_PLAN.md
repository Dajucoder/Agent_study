# 项目改进计划（IMPROVEMENT PLAN）

> 配套源码改进使用。每完成一项，把该行的 `[ ]` 改成 `[x]`，并把"实际改动说明 / 涉及文件"补到对应行下方。
>
> 完成时间：2026-07-07
> 范围：基于上一轮"项目体检"中识别的可落地项，按 **学习价值 / 改动成本** 排序。

---

## P0 · 文档与一致性（影响新人第一感受）

### [x] P1 · `.gitignore` 调整：让 `data/docs/` 进库
- 现状：第 29 行 `data/` 整体忽略，导致 `data/docs/sample.txt` 不会被 git 跟踪，新人 `clone` 后跑 `04_rag.py` 找不到文件。
- 计划：
  - 把 `data/` 整体忽略改为只忽略 `data/chroma/`、`data/cache/`、`data/uploads/`。
  - 显式 `!data/docs/` 取消忽略示例数据目录。
- **改动**：
  - `.gitignore` 第 28-35 行：新增 `data/chroma/`、`data/cache/`、`data/uploads/` 三条忽略规则，加 `!data/docs/` 排除例外。
  - 验证：`git add -n data/docs/sample.txt` 成功，`data/chroma` 仍被忽略。

### [x] P2 · README / `PROJECT_STRUCTURE.md` 命名一致
- 现状：
  - `PROJECT_STRUCTURE.md` 第 45-58 行 `examples/` 写的是 `01_simple_chat.py ~ 07_serve.py`。
  - 实际目录是 `00_check.py ~ 06_langserve.py`。
  - README 第 60 行说 `notebooks/` 仅"已提供 00_getting_started.ipynb"，但实际 7 个笔记本都在。
- 计划：
  - `PROJECT_STRUCTURE.md`：把示例命名改为 00-06 并增加"前导脚本"角色说明。
  - README 第 60 行：改为"已提供 0~6 共 7 个笔记本"。
- **改动**：
  - `docs/PROJECT_STRUCTURE.md` `examples/` / `notebooks/` 两节重写，与实际目录一致。
  - `README.md` 第 60 行改为"已提供 **0~6 共 7 个交互式笔记本**"。

### [x] P12 · `03_memory.py` 修 `StrOutputParser` 丢失消息类型
- 现状：链是 `prompt | llm | StrOutputParser()`，模型回复被序列化成字符串再被 `RunnableWithMessageHistory` 写回，长期运行易出现 schema 风险。
- 计划：链层去掉 `StrOutputParser`，在 `invoke` 后用 `print(content)`；或拆成"展示"用字符串、底层链保留 `AIMessage`。
- **改动**：
  - `examples/03_memory.py` 底层链改为 `prompt | llm`（保留 `AIMessage`），展示时取 `reply.content`。
  - 注意：`RunnableWithMessageHistory` 在 langchain 1.x 已 deprecated，仅 warning 不影响功能；本项目保留是为了兼容老教程。

---

## P1 · 代码质量（可读性 / 复用性）

### [x] P3 · 抽取 `examples/_common.py`，去掉 7 个脚本中的样板代码
- 现状：每个脚本顶部重复 `load_dotenv()` + `check_key()` + `ChatOpenAI(model=os.getenv(...))`。
- 计划：
  - 新建 `examples/_common.py`，提供 `get_env(name, default=None)`、`require_env(name)`、`get_llm()`、`get_embeddings()`、`get_logger()`。
  - 重构 `00~06` 全部脚本，统一 `from _common import ...`。
- **改动**：
  - 新建 `examples/_common.py`：`check_api_key / require_env / get_llm / get_embeddings / data_path / project_root / format_docs / _safe_eval`。
  - `00_check.py` / `01_models_prompts.py` / `02_chains.py` / `03_memory.py` / `04_rag.py` / `05_agents.py` / `06_langserve.py` 全部改为 `from _common import ...` + `def main():` + `if __name__ == "__main__":` 入口。
  - 全部通过 `python -m py_compile` 编译。

### [x] P4 · `04_rag.py` 改造：向量库已存在则加载，避免重复计费
- 现状：每次都 `Chroma.from_documents(...)`，会再次向量化、再次计费。
- 计划：
  - 判断 `PERSIST_DIR` 目录是否存在；
  - 存在 → `Chroma(persist_directory=..., embedding_function=...)` 加载；
  - 不存在 → 走原 `from_documents` 流程。
- **改动**：
  - `examples/04_rag.py` 新增 `build_or_load_vectorstore()`：`PERSIST_DIR.exists() and any(PERSIST_DIR.iterdir())` 则加载；否则构建。
  - 加 `try/except` 友好提示：embedding 模型不匹配或 chroma 目录损坏时给出排查指引。

### [x] P5 · `05_agents.py` 替换 `eval` 为安全计算器
- 现状：使用 `eval(expression, {"__builtins__": {}}, {})`。
- 计划：
  - 用 `simpleeval` 或自写"四则运算 + 括号"解析器。
  - 文档 `docs/05-agents.md` 常见坑补一条"生产中绝不要 eval"。
- **改动**：
  - `_safe_eval(expr)` 移至 `examples/_common.py`，基于 `ast` 解析白名单（仅 `Constant/BinOp/UnaryOp/Expression`），拒绝变量/函数/属性/索引。
  - `tests/test_calculator.py` 覆盖 8 个合法表达式 + 4 个攻击向量（`__import__` / `open()` / `lambda` / 列表推导）。
  - 待补：更新 `docs/05-agents.md` 的"常见坑"章节（属 P4 后续，本批先做代码）。

### [x] P6 · `06_langserve.py` 增强：CORS、`/health`、`reload`
- 现状：默认 `host=0.0.0.0`、无 CORS、无健康检查、reload 不可用。
- 计划：
  - 加 `CORSMiddleware(allow_origins=["*"])`（生产再收紧）。
  - 加 `@app.get("/health")` 端点。
  - `uvicorn.run(..., reload=os.getenv("DEV")=="1")`。
- **改动**：
  - 拆出 `create_app()` 工厂函数便于测试复用。
  - 加 `CORSMiddleware`、加 `@app.get("/health")`。
  - `uvicorn.run(..., reload=os.getenv("DEV") == "1")`，并支持以包形式启动：`uvicorn examples.06_langserve:app`。

### [x] P7 · `03_memory.py` 增加断言 + `main()` 入口
- 现状：注释"应能回答小明"没有强制校验。
- 计划：把演示逻辑包成 `def main(): ...`；加 `assert "小明" in reply`；补 `if __name__ == "__main__":` 守卫。
- **改动**：
  - 全脚本包成 `main()`，加 `if __name__ == "__main__": main()`。
  - 加 `assert "小明" in reply_2.content` 与 `assert "小明" not in new_session_reply.content`，跑通后打印 `✓ 自检通过`。

---

## P2 · 依赖与可复现性

### [x] P8 · 生成 `requirements.lock` 并更新 `requirements.txt`
- 现状：所有依赖都 `>=`，跨环境不一致。
- 计划：
  - `pip freeze > requirements.lock` 或 `uv pip compile`。
  - `requirements.txt` 顶部加注释"想用锁版本请 `pip install -r requirements.lock`"。
  - `LangSmith` 改为可选 extra：`.[observability]`。
- **改动**：
  - 新建 `requirements.lock`：与 `.venv` 实际安装一致（langchain 1.3.11、langchain-classic 1.0.8、openai 2.26.0、chromadb 1.5.2 等）。
  - 重写 `requirements.txt`：用 `>=` 但提示 `requirements.lock` 才是可复现选择；移除 `langsmith` 注释，改为 "安装：`pip install langsmith`"。
  - 注意：项目 .venv 中 `langchain-chroma` 未安装，所以 Chroma 仍走 `langchain_community` 路径（有 deprecation warning），但功能正常。

---

## P3 · 工程化与质量门禁

### [x] P9 · 新增 `tests/` 目录与 smoke 测试
- 现状：完全没有测试。
- 计划：
  - `tests/test_prompts.py`：断言 `ChatPromptTemplate` 拼装结果包含变量。
  - `tests/test_format_docs.py`：断言 `format_docs` 把 `Document.page_content` 用 `\n\n` 连接。
  - `tests/test_calculator.py`：断言安全计算器支持 `+ - * /` 与括号。
  - 全部不依赖外部 LLM，可离线跑。
- **改动**：
  - 新建 `tests/__init__.py` + `tests/conftest.py`（把 `examples/` 加进 sys.path）。
  - `tests/test_prompts.py`：2 个用例。
  - `tests/test_format_docs.py`：2 个用例。
  - `tests/test_calculator.py`：12 个参数化用例。
  - **结果：`16 passed in 12.62s`**，全离线可跑。

### [x] P10 · 新增 `Makefile` 统一常用命令
- 计划：
  - `make help`：列出所有目标。
  - `make setup` / `make check` / `make run-04` / `make test` / `make lint` / `make clean`。
  - Windows PowerShell 兼容（额外提供 `make.ps1` 或在 README 说明）。
- **改动**：
  - 新建 `Makefile`：默认 `PY ?= python`，目标 `help / setup / check / run-00..06 / test / lint / clean`。
  - 新建 `Makefile.ps1`：Windows PowerShell 等价物（`run-04` 等价于 `make run-04`）。

### [x] P11 · 新增 `.github/workflows/ci.yml`
- 计划：
  - `ruff check .`
  - `pytest -q`
  - 多 Python 版本矩阵（3.10 / 3.11 / 3.12）。
- **改动**：
  - 新建 `.github/workflows/ci.yml`：Ubuntu + Python 3.10/3.11/3.12 矩阵；step：setup-python → `pip install -r requirements.txt` → `pip install pytest ruff` → `ruff check` → `pytest -q`。
  - 在 CI 环境中用 `OPENAI_API_KEY=dummy` 占位（测试不需要真实 LLM）。

---

## P4 · 后续（已全部完成于 v0.3.0）

- [x] P13 · `examples/07_ollama_local.py`：Ollama 本地模型分支示例
- [x] P14 · `examples/08_qwen.py`：通义千问 DashScope 兼容模式示例
- [x] P15 · `docs/COST_AND_LIMITS.md`：成本控制章节
- [x] P16 · `docs/OBSERVABILITY.md`：LangSmith 入门与 debug 技巧
- [x] P17 · 引入 `pre-commit`（ruff + ruff-format + yamllint）
- [x] P18 · `docs/05-agents.md` 补"绝不要 eval"提示（与 P5 配套）
- [x] Dockerfile + Docker Hub / GHCR 自动构建发布
- [x] mkdocs 文档站点（Material 主题）+ GitHub Pages 自动部署

---

## 实施日志

> 每完成一项 P 后，在本节追加一条"日期 + 完成项 + 涉及文件 + 备注"。

- 2026-07-07 · 创建本计划文档
- 2026-07-07 · P1 完成（`.gitignore`）
- 2026-07-07 · P2 完成（`README.md` + `PROJECT_STRUCTURE.md`）
- 2026-07-07 · P3+P4+P5+P6+P7+P12 完成（`examples/_common.py` 与 7 个脚本重构 + 04_rag 加载逻辑 + 安全计算器 + LangServe CORS/health + 03_memory main/assert + 03_memory 修消息类型）
- 2026-07-07 · P8 完成（`requirements.lock` + `requirements.txt`）
- 2026-07-07 · P9 完成（`tests/` + 16 个测试全过）
- 2026-07-07 · P10 完成（`Makefile` + `Makefile.ps1`）
- 2026-07-07 · P11 完成（`.github/workflows/ci.yml`）
- 2026-07-07 · 推送 v0.2.0 → 推送 v0.2.1（补齐仓库元数据 / 社区健康 / CI 自动化 / 文档增量）
- 2026-07-07 · P13~P18 + Dockerfile + mkdocs 全部完成 → 推送 v0.3.0

### 实际验证结果

- `python examples/00_check.py` → ✓ 模型调用成功
- `python examples/01_models_prompts.py` → ✓ 4 段演示全部通过
- `python examples/02_chains.py` → ✓ 编译通过
- `python examples/03_memory.py` → ✓ 3 轮对话 + 自检通过
- `python examples/05_agents.py` → ✓ Agent 调用 calculator 与 get_current_time
- `pytest tests/ -q` → ✓ **16 passed in 12.62s**
- `python examples/04_rag.py` → 第三方 embedding 端点不匹配时报清晰提示（按设计行为）

---

# v0.5.0 路线（新增 · 2026-07-09）

> 上面的 P0~P4 全部已于 v0.3.0 / v0.4.0 / v0.4.1 落地。本节基于新一轮"项目体检"，
> 按 **学习价值 / 改动成本** 排序，提出下一阶段的改进项。
>
> 体检范围：`examples/` 9 个脚本、`examples/_common/` 5 个子模块、`tests/` 4 个文件、
> `docs/` 32 篇（含 `.en.md`）、`.github/workflows/` 6 个、`Dockerfile` / `mkdocs.yml` / `pre-commit`。
>
> 参考承诺：CHANGELOG `[Unreleased]` 中已列出 LangGraph 迁移、mkdocs 自定义主题、Dockerfile 最佳实践、CI 加 mypy/bandit（前两项在 v0.4.0 已实现 mypy/bandit）。

---

## 项目体检摘要

| 维度 | 现状 | 备注 |
| --- | --- | --- |
| 文档 | 16 篇 ZH + 16 篇 EN，命名/版本基本一致 | 06 文档练习任务仍写 `07_serve.py`；ARCHITECTURE "后续路线"已过期 |
| 代码 | 9 个 examples + 5 个 _common 子模块，统一 `from _common import` | 01 仍用 `PydanticOutputParser`（已被 `with_structured_output` 取代）；03 仍用已 deprecated 的 `RunnableWithMessageHistory` |
| 测试 | 16 个用例，3 个文件，覆盖安全计算器 / format_docs / prompt 模板 | 缺 03 / 04 / 06 离线测试；coverage 70% 门槛擦边 |
| CI | ubuntu + Python 3.10/3.11/3.12 + ruff/mypy/bandit/coverage | 未验证 Windows（`Makefile.ps1` 实际未跑过） |
| 依赖 | `requirements.txt`（宽松） + `requirements.lock`（手维护） | 缺自动校验；缺 dev/optional 拆分 |
| 部署 | Dockerfile（多阶段/non-root）+ docker.yml + mkdocs.yml | 缺 HEALTHCHECK、缺 volume 挂载说明 |
| 可观测 | 文档 OBSERVABILITY.md 仅 LangSmith | 无 OTel / 无 token 计数 demo |
| 缓存 | `COST_AND_LIMITS.md` 提到 `InMemoryCache` 但 examples 没对应脚本 | 新手找不到"在哪看缓存" |
| RAG 进阶 | 04 单切片、固定 k | 无 re-ranking / hybrid search / 评估 |
| 导航 | 入口有 README 目录树 | `examples/` / `notebooks/` 无独立 INDEX.md |

---

## P0 · 文档一致性与必修（最高 ROI · 建议 v0.5.0 立即做）

> 这一档全部是"低成本、高确定性"修复，预计 1~2 个 PR 就能合并。

### [ ] P21 · 修复 `docs/06-langserve-and-deployment.md` 练习任务文件名
- **现状**：`docs/06-langserve-and-deployment.md:43` 仍写"写 `examples/07_serve.py`"，但实际脚本名是 `06_langserve.py`。
- **计划**：把第 43 行的 `examples/07_serve.py` 改为 `examples/06_langserve.py`；同时核对其英文版（`06-langserve-and-deployment.en.md`）是否同步。
- **验证**：`grep -rn "07_serve" docs/` 应无任何命中。

### [ ] P22 · 修复 `CHANGELOG.en.md` 中提到的"不存在的子模块"
- **现状**：`CHANGELOG.en.md:30` 写"`examples/_common/` split into submodules: `llm.py`, `embeddings.py`, `io.py`, `calc.py`"，但 `embeddings.py` 实际不存在（embedding 工厂在 `llm.py` 里）。
- **计划**：把 `embeddings.py` 移除，让英文 CHANGELOG 与中文版及实际目录一致。
- **验证**：`ls examples/_common/` 应输出 `__init__.py calc.py env.py io.py llm.py paths.py`。

### [ ] P23 · 清理 `docs/ARCHITECTURE.md` 第 6 节"后续路线"
- **现状**：第 110-116 行的"后续路线"4 项（Ollama / 通义千问 / mkdocs / Dockerfile）**已在 v0.3.0 全部落地**，但 ARCHITECTURE.md 没更新。
- **计划**：用新一节"## 7. v0.5.0 候选路线"替换原"## 6. 后续路线"，把已完成的 4 项从勾选清单挪到"历史里程碑"。
- **验证**："后续路线"小节不再出现 4 个 `[ ]` 勾选项。

### [ ] P24 · `.env.example` 补全分支模型变量
- **现状**：`.env.example` 只列了 OpenAI / LangSmith / Chroma 路径，缺 07/08 用到的 `DASHSCOPE_API_KEY` / `DASHSCOPE_BASE_URL` / `DASHSCOPE_MODEL` / `OLLAMA_BASE_URL`。
- **计划**：在文件底部新增 "---- 分支模型（按需）----" 一节，列 4 个变量（含注释说明）。
- **验证**：复制 `.env.example` 为 `.env` 后，07 / 08 跑前不会触发 "未找到 XXX"。

### [ ] P25 · `Makefile` 增 `format` / `coverage` / `security` / `lock-check` 目标
- **现状**：`Makefile` 只有 `test / lint / clean`，缺 `format`（`ruff format`）、`coverage`（`coverage report --html`）、`security`（`bandit`）、`lock-check`（校验 `requirements.txt` 与 `.lock` 不冲突）。
- **计划**：追加：
  ```make
  format:  ; ruff format examples/ tests/
  coverage: ; coverage run -m pytest tests/ -q && coverage html
  security: ; bandit -ll -q -r examples/ tests/
  lock-check:
  	  pip install --dry-run -r requirements.lock
  ```
  同步在 `Makefile.ps1` 加同名 switch-case。
- **验证**：`make help` 输出 9 个目标；`make format` 不报错。

### [ ] P26 · CI 矩阵加 `windows-latest` 验证 PowerShell 脚本
- **现状**：`.github/workflows/ci.yml` 仅 `ubuntu-latest`，`Makefile.ps1` 从未被 CI 实际执行过。
- **计划**：在 `matrix.os` 中加入 `windows-latest`；windows 步骤跳过 `bandit`（windows 装包慢）但保留 `ruff / pytest`；`make.ps1` 步骤用 `powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 test`。
- **验证**：CI 日志中 windows 任务跑通 `test` 目标。

### [ ] P27 · CI 加 `requirements.lock` 可解析性校验
- **现状**：`requirements.lock` 没人校验，新人拉下来 `pip install -r requirements.lock` 才知有冲突。
- **计划**：在 CI 的 "Install dependencies" 后插入 `pip install --dry-run -r requirements.lock`；失败则 fail。
- **验证**：故意把 `.lock` 中一个版本改成不存在的 `999.0.0` 时，CI 报红。

---

## P1 · 跟上 langchain 1.x 现代 API（核心学习价值）

> langchain 1.x 已对若干老 API 标 deprecated 或替换。新人照着教程抄老代码会遇到 warning。

### [ ] P28 · `01_models_prompts.py` 迁 `with_structured_output`
- **现状**：第 4 段用 `PydanticOutputParser(pydantic_object=Translation)` + `get_format_instructions()` + 手动 `.partial(...)`。1.x 推荐 `llm.with_structured_output(Translation)` 一行搞定，模型自动按 schema 校验。
- **计划**：
  - 把第 4 段重写为 `structured_llm = llm.with_structured_output(Translation)` + `structured_llm.invoke({...})`。
  - 保留一段 `PydanticOutputParser` 作为"对比"注释（"老 API 写法，1.x 不推荐"），用 `# noqa: E800` 标注不推荐。
  - 顶部 docstring 注明"`PydanticOutputParser` 仍能用，但 1.x 推荐 `with_structured_output`"。
- **验证**：`python examples/01_models_prompts.py` 输出 `language=英语, text=Hello, world`。

### [ ] P29 · `03_memory.py` 增 LangGraph 对照示例
- **现状**：完全依赖已 deprecated 的 `RunnableWithMessageHistory`（langchain 1.x 仍可用但有 warning）；CHANGELOG `[Unreleased]` 承诺"用 LangGraph 替代"。
- **计划**：
  - 把 `03_memory.py` 改名为 `03_memory_runnable.py`（保留作"对比"），并新建 `03_memory_graph.py` 用 LangGraph 的 `StateGraph` + `MemorySaver` 实现等价功能。
  - 顶层 `03_memory.py` 改为 3 行引导："推荐看 `03_memory_graph.py`；`03_memory_runnable.py` 演示老 API 路径"——避免破坏既有 README 引用。
  - `docs/03-memory.md` 加一节"## 5. 进阶：LangGraph 风格"。
- **验证**：两个脚本独立跑通 + 自检通过；`grep RunnableWithMessageHistory examples/03_memory_graph.py` 无命中。

### [ ] P30 · `_common/llm.py` 加 `temperature / timeout / max_retries` 默认值
- **现状**：`get_llm` / `get_embeddings` 不传任何运行时参数；用户得自己知道要加 `timeout=30`。
- **计划**：
  - `get_llm(..., temperature=None, timeout=None, max_retries=None)`：未传时从 `.env` 读 `OPENAI_TEMPERATURE / OPENAI_TIMEOUT / OPENAI_MAX_RETRIES`，缺省 0.7 / 30 / 2。
  - `get_embeddings` 同理（`timeout`）。
  - `.env.example` 加 3 行注释。
- **验证**：`.env` 不设时 `llm.temperature == 0.7`；显式传 `temperature=0` 时覆盖。

### [ ] P31 · 新增 `examples/09_caching.py`（缓存层示例）
- **现状**：`docs/COST_AND_LIMITS.md` 2.4 节提到了 `InMemoryCache` / `SQLiteCache` / `RedisCache`，但 examples 无对应脚本。
- **计划**：新增 09_caching.py：
  - 段 1：`set_llm_cache(InMemoryCache())` + 同一问题跑两次，观察第二次秒回。
  - 段 2：`SQLiteCache(database_path=".cache/langchain.db")` + 跨进程复用。
  - 段 3：用 `langchain.globals.get_llm_cache` 检查当前是否命中。
- **验证**：第二次 `chain.invoke(q)` 在缓存命中时打印 `Hit!`；时间差 < 50ms。

---

## P2 · 测试与质量门禁（防回归）

> 当前 16 个测试只覆盖 _safe_eval / format_docs / ChatPromptTemplate 这 3 个无 LLM 依赖的纯逻辑。
> 一旦改 `04_rag` / `03_memory` / `06_langserve` 就只能靠人肉跑。

### [ ] P32 · 补 `_common` 各子模块的单元测试
- **现状**：`_common/env.py` / `paths.py` / `io.py` 完全无测试。
- **计划**：
  - `tests/test_env.py`：`get_env` 缺省值 / `require_env` 缺失抛 SystemExit / `check_api_key` 行为。
  - `tests/test_paths.py`：`data_path("chroma")` 返回 `<PROJECT_ROOT>/data/chroma`。
  - `tests/test_io.py`：`format_docs` 单 Document / 含空 content 边界。
- **验证**：`pytest tests/ -q` 计数从 16 升到 30+。

### [ ] P33 · `04_rag.py` 用 Fake Embeddings 离线测 RAG 链拼装
- **现状**：`04_rag.py` 必连真实 LLM / OpenAI Embedding；改坏了只有跑通才知。
- **计划**：
  - `tests/test_04_rag.py`：用 `langchain_core.embeddings.FakeEmbeddings` 替代 `OpenAIEmbeddings`，把 4 句样本塞进 `Chroma(embedding_function=FakeEmbeddings(size=128))`，再跑 `rag_chain.invoke(...)`。
  - 断言返回类型是 `str` 且非空。
- **验证**：测试在 `OPENAI_API_KEY=dummy` 下跑通。

### [ ] P34 · `03_memory.py` 用 mock LLM 离线测自检断言
- **现状**：自检 (`assert "小明" in reply_2.content`) 依赖真实 LLM 回复。
- **计划**：
  - `tests/test_03_memory_logic.py`：用 `unittest.mock.Mock` 替换 `ChatOpenAI`，让 mock 在第二轮返回 `"我记得你叫小明"`；验证断言通过。
  - 把 `RunnableWithMessageHistory` 的拼装部分（`build_chain_with_history`）抽成纯函数，测试不依赖外部。
- **验证**：mock 测试与真实 LLM 测试都通过；测试耗时 < 1s。

### [ ] P35 · `06_langserve.py` 用 FastAPI TestClient 测端点
- **现状**：`_common` 有 `create_app()` 工厂，但没人测它。
- **计划**：
  - `tests/test_06_langserve.py`：用 `fastapi.testclient.TestClient` + monkeypatch `get_llm` 为 mock，断言：
    - `GET /health` → `200 {"status": "ok"}`
    - `GET /` → 200（LangServe 根信息）
    - `GET /chain/input_schema` → 200 + 合法 JSON
- **验证**：CI 离线可跑；不需要真实 API Key。

### [ ] P36 · coverage 门槛从 70% 抬到 85%
- **现状**：`pyproject.toml` 配 `--fail-under=70`；当前实际覆盖率可能 60% 出头（`omit` 了 2 个脚本、tests）。
- **计划**：
  - `pyproject.toml` 的 `tool.coverage.run.source` 加上 `examples/_common`。
  - `tool.coverage.report` 把 `fail-under` 改成 `85`。
  - 配套把 P32~P35 的新测试加上。
- **验证**：`coverage report` 输出 `TOTAL ... 85%` 或以上。

---

## P3 · RAG 进阶 / 可观测性 / 部署（让示例贴近真实工程）

### [ ] P37 · 新增 `examples/10_rag_eval.py`（RAG 评估）
- **现状**：04 能跑但无法回答"改完切分后效果变好还是变差"。
- **计划**：
  - 段 1：自建"上下文命中率"——准备 5 条 `{"question": ..., "expected_keywords": [...]}`，跑 04 链后断言回答中至少出现 1 个关键词。
  - 段 2：可选 RAGAS（`pip install ragas`）做 faithfulness / answer_relevancy 评估；不可用时优雅降级。
  - 写到 `docs/04-retrieval-and-rag.md` "## 进阶：评估" 一节。
- **验证**：5 个测试问题中至少 4 个命中关键词；不依赖真实 embedding 维度。

### [ ] P38 · 新增 `examples/11_observability.py`（OTel + LangSmith + token 计数）
- **现状**：`docs/OBSERVABILITY.md` 只讲 LangSmith 概念，没 demo。
- **计划**：
  - 段 1：`get_openai_callback()` 跑链后打印 token / cost。
  - 段 2：开启 `LANGCHAIN_TRACING_V2=true` 后跑一次，引导用户去 smith.langchain.com 查看。
  - 段 3：用 `langchain_core.tracers` 配 OpenTelemetry exporter（`OTLPSpanExporter` → Jaeger / Tempo），可选。
- **验证**：段 1 打印 `Total Tokens: 123 / Total Cost (USD): 0.0001` 之类。

### [ ] P39 · Dockerfile 加 `HEALTHCHECK` + 文档化 volume
- **现状**：`Dockerfile` 没有 `HEALTHCHECK`；`data/chroma` 没挂载说明。
- **计划**：
  - 加 `HEALTHCHECK CMD curl --fail http://localhost:8000/health || exit 1`（runtime 阶段装 `curl`）。
  - `README.md` 部署小节加：
    ```bash
    docker run -d -p 8000:8000 \
      -v $(pwd)/data/chroma:/app/data/chroma \
      -e OPENAI_API_KEY=$OPENAI_API_KEY \
      agent-study:latest
    ```
- **验证**：`docker inspect --format='{{json .Config.Healthcheck}}' agent-study` 输出 JSON。

### [ ] P40 · mkdocs 真正双语（mkdocs-static-i18n 插件）
- **现状**：`mkdocs.yml` 把 `*.en.md` 排除，只渲染中文站；英文版只能去 GitHub 看。
- **计划**：
  - 引入 `mkdocs-static-i18n`：在 `docs/en/` 下放英文原文（`mv docs/*.en.md docs/en/`）。
  - 顶部加语言切换器："中文 / English"。
  - 部署：保留单 `mkdocs.yml` 但 `i18n` 插件自动产两个站点。
- **验证**：`mkdocs build` 产物在 `site/en/` 下能访问 `01-models-and-prompts/`。

### [ ] P41 · 引入 `pydantic-settings` 集中管理 .env
- **现状**：每个脚本用 `os.getenv("OPENAI_API_KEY")` 散落在 `_common/env.py` 5 个 helper 里；类型靠人脑记。
- **计划**：
  - 新建 `_common/settings.py`：`class Settings(BaseSettings): openai_api_key: str; openai_model: str = "gpt-4o-mini"; openai_embedding_model: str = "text-embedding-3-small"; openai_api_base: str | None = None; langchain_tracing_v2: bool = False; ...`。
  - `env.py` 的 helper 改为读 `Settings()` 单例。
- **验证**：`make run-01` 行为不变；`mypy` 在 `Settings` 上无报错。

---

## P4 · 体验与导航（让仓库更好逛）

### [ ] P42 · `examples/INDEX.md` 入口导航
- **内容**：表格列出 9 个脚本（00~08）的"主题 / 前置依赖 / 跑通时间 / 适合谁"，点击跳到对应文件。
- **影响**：新人 1 分钟决定先看哪个。

### [ ] P43 · `notebooks/INDEX.md` 入口导航
- **内容**：7 个笔记本的"主题 / 难度 / 与 example 关系"。
- **影响**：与 P42 互补。

### [ ] P44 · `docs/04-retrieval-and-rag.md` 补 Re-ranking / Hybrid Search 示例
- **现状**：延伸阅读里只提了一行。
- **计划**：新增"## 5. 进阶检索技术"小节，简述 BM25 + 向量混合检索、Cross-Encoder 重排；不附完整代码（避免仓库膨胀），给官方链接。

### [ ] P45 · `CONTRIBUTING.md` 增"提交 PR 前跑 `make test`"指引
- **计划**：在"## 提交流程"小节加：
  - 必跑：`make lint && make test`
  - 推荐跑：`make format && make coverage`
  - PR 标题遵循 Conventional Commits（已配 release-drafter）。
- **影响**：让贡献者无意中触发同款 CI 失败。

### [ ] P46 · `pyproject.toml` 把 `_common` 加进 `tool.coverage.run.source`
- 与 P36 配套。

---

## P5 · 远期（已写入 CHANGELOG `[Unreleased]`）

> 这些是 v0.6.0+ 的方向，本批不在 v0.5.0 范围，但保持追踪。

- [ ] **P47 · LangGraph 完整示例**（与 P29 配套：当 03_memory_graph.py 跑稳后扩展到 multi-agent、human-in-the-loop）
- [ ] **P48 · Notebook 回归测试**（`pytest --nbval-lax notebooks/` + pre-commit 加 `nbstripout` 清输出）
- [ ] **P49 · OpenTelemetry 全面接入**（P38 段 3 的延续，把所有示例接入 OTel exporter）
- [ ] **P50 · uv 替换 pip**（`uv pip compile requirements.in -o requirements.lock` 自动生成锁文件；CI 校验 `requirements.lock` 与 `requirements.txt` 无冲突）
- [ ] **P51 · 多向量库后端示例**（FAISS / Qdrant / Milvus 各一段，把 `04_rag.py` 的 Chroma 抽象出去）
- [ ] **P52 · 流式 Web UI 演示**（FastAPI + SSE + 极简 HTML 前端，演示 `chain.stream` 实时回显）

---

## 实施日志（v0.5.0 阶段）

> 实施时按 PR 顺序追加；每完成一项把 `[ ]` 改成 `[x]` 并把"实际改动说明 / 涉及文件"补到对应行下方。

- 2026-07-09 · 启动 v0.5.0 路线规划；本节新增
- 待补 · P21~P27（文档与 CI 必修，预计 1~2 个 PR）
- 待补 · P28~P31（现代 API 迁移，预计 1 个 PR）
- 待补 · P32~P36（测试覆盖提升，预计 1 个 PR）
- 待补 · P37~P41（RAG 评估 / 可观测 / 部署，预计 2~3 个 PR）
- 待补 · P42~P46（体验优化，预计 1 个 PR）
- 待补 · 推 v0.5.0

---

## 体检后建议的版本路线

| 版本 | 主要内容 | 预计 PR 数 |
| --- | --- | --- |
| v0.4.2（热修） | P21 / P22 / P23 / P24 文档一致性 | 1~2 |
| v0.5.0 | P25~P46（CI / 现代 API / 测试 / RAG / 可观测 / 体验） | 6~8 |
| v0.6.0 | P47~P52（LangGraph 完整化 / uv / OTel / 多向量库 / 流式 UI） | 5~7 |
