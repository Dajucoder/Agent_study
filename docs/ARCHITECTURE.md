# 架构总览（Architecture）

> 写给"想从全局理解项目"的读者。读完后你应该能用一张图画清本项目的模块关系。

## 1. 设计目标

| 目标 | 说明 |
| --- | --- |
| 学习驱动 | 每个概念都对应一个 `examples/0x_*.py`，**所见即所学** |
| 工程化 | 提供 CI、测试、Makefile，安全（无 `eval`）、可复现（requirements.lock） |
| 渐进式 | 章节 01~06 由浅入深，每章建立在前一章之上 |
| 可扩展 | 公共能力放 `_common.py`，新增章节只需新增一个脚本 |

## 2. 模块关系

```
┌────────────────────────────────────────────────────────────┐
│                        用户 (User)                          │
└──────┬──────────────────────────────────┬──────────────────┘
       │ 文档                             │ 代码
       ▼                                  ▼
┌─────────────────┐               ┌─────────────────┐
│   docs/         │               │   examples/     │
│  学习文档       │               │  可运行脚本      │
│  (9 篇)         │               │  (00~06 + common)│
└────────┬────────┘               └────────┬────────┘
         │                                │
         │   互为索引                      │ import
         └────────────┐       ┌───────────┘
                      ▼       ▼
                 ┌─────────────────────────┐
                 │  LangChain / 第三方库     │
                 │  - langchain 1.x         │
                 │  - langchain-classic 0.x │
                 │  - openai / chroma ...   │
                 └────────────┬────────────┘
                              │ 调用
                              ▼
                 ┌─────────────────────────┐
                 │  LLM Provider           │
                 │  OpenAI / 第三方 / 本地  │
                 └─────────────────────────┘

辅助系统：
  tests/    → pytest 离线 smoke 测试
  .github/  → CI / Issue / PR / Release
  data/     → 示例文档 + Chroma 持久化
  notebooks/→ 交互式实验
```

## 3. 数据流：以 RAG 为例

```
用户问题
   │
   ▼
[Retriever]      ←—————  Chroma 向量库（data/chroma/）
   │  top-k chunks
   ▼
[format_docs]    ←—————  examples/_common.py::format_docs
   │  "\n\n" 拼接
   ▼
[ChatPromptTemplate]   ←—————  RAG 提示词模板
   │  {context} + {question}
   ▼
[ChatOpenAI]      ←—————  .env OPENAI_API_KEY / MODEL
   │  AIMessage
   ▼
[StrOutputParser] ←—————  提取 content
   │
   ▼
用户可见回答
```

## 4. 关键设计决策

### 4.1 公共工具集中到 `_common.py`
7 个示例脚本共享 `check_api_key / get_llm / get_embeddings / data_path / format_docs / _safe_eval`，避免样板代码重复。

### 4.2 测试不依赖真实 LLM
`tests/` 下的 16 个测试覆盖：
- ChatPromptTemplate 拼装（纯字符串）
- format_docs 拼接（纯逻辑）
- 安全计算器（纯 AST 解析）

CI 用 `OPENAI_API_KEY=dummy` 占位即能跑通。

### 4.3 依赖锁定与可复现
- `requirements.txt`：宽松（`>=`）便于学习
- `requirements.lock`：严格（`==`）用于 CI / 复现

### 4.4 安全默认值
- `05_agents.py` 不用 `eval`，用 AST 白名单
- `.env` 已在 `.gitignore`
- SECURITY.md 给出"密钥泄露 → 轮换"流程

## 5. 扩展点

| 想加什么 | 改哪里 |
| --- | --- |
| 新示例 | `examples/0x_xxx.py`，按需复用 `_common` |
| 新笔记本 | `notebooks/0x_xxx.ipynb` |
| 新文档章节 | `docs/0x-xxx.md` + 在 `README.md` 目录树加入 |
| 新工具 | 在 `_common.py` 加 helper |
| 新 CI 任务 | `.github/workflows/*.yml` |
| 新测试 | `tests/test_xxx.py` |

## 6. 后续路线

- [ ] Ollama / 通义千问分支示例
- [ ] LangGraph 替代 RunnableWithMessageHistory
- [ ] 引入 `mkdocs` 文档站点
- [ ] Dockerfile 镜像
