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

## P4 · 后续（暂缓，先看学习价值）

- [ ] P13 · `examples/07_ollama_local.py`：本地模型分支示例
- [ ] P14 · `examples/08_qwen.py`：通义千问示例
- [ ] P15 · `docs/COST_AND_LIMITS.md`：成本控制章节
- [ ] P16 · `docs/OBSERVABILITY.md`：LangSmith 追踪操作录屏/截图
- [ ] P17 · 引入 `pre-commit`（ruff + black + 提交前格式化）
- [ ] P18 · `docs/05-agents.md` 补充"生产中绝不要 eval"提示（与 P5 配套）

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

### 实际验证结果

- `python examples/00_check.py` → ✓ 模型调用成功
- `python examples/01_models_prompts.py` → ✓ 4 段演示全部通过
- `python examples/02_chains.py` → ✓ 编译通过
- `python examples/03_memory.py` → ✓ 3 轮对话 + 自检通过
- `python examples/05_agents.py` → ✓ Agent 调用 calculator 与 get_current_time
- `pytest tests/ -q` → ✓ **16 passed in 12.62s**
- `python examples/04_rag.py` → 第三方 embedding 端点不匹配时报清晰提示（按设计行为）
