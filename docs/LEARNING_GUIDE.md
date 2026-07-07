# 学习路线总纲（Learning Guide）

> 🌐 **English version**: [LEARNING_GUIDE.en.md](LEARNING_GUIDE.en.md)

本文档给出推荐的 LangChain 学习顺序与每阶段的目标、投入时间建议。请配合 `docs/0x-*.md` 各章节文档与 `notebooks/`、`examples/` 中的动手练习。

## 前置知识

在开始之前，请确认你已具备：

- Python 3.10+ 基础（函数、类、装饰器、异步基础）。
- 了解 LLM 是什么、能用 API（如 OpenAI）完成一次"问答"。
- 会创建并使用 Python 虚拟环境，能读懂 `requirements.txt`。

若以上有缺口，先补 Python 与"调用一次 Chat Completions API"的体验，再进入下面章节。

## 推荐学习顺序

| 阶段 | 主题 | 文档 | 目标产出 | 建议时长 |
| --- | --- | --- | --- | --- |
| 0 | 环境搭建 | [ENV_SETUP.md](ENV_SETUP.md) | 能跑通第一个 LLM 调用 | 0.5 天 |
| 1 | 模型与提示词 | [01-models-and-prompts.md](01-models-and-prompts.md) | PromptTemplate + ChatModel 小demo | 1 天 |
| 2 | 链 Chains | [02-chains.md](02-chains.md) | 用 LCEL 串起多步流程 | 1 天 |
| 3 | 记忆 Memory | [03-memory.md](03-memory.md) | 多轮带上下文对话 | 1 天 |
| 4 | 检索与 RAG | [04-retrieval-and-rag.md](04-retrieval-and-rag.md) | 基于本地文档的问答 | 2 天 |
| 5 | 代理 Agents | [05-agents.md](05-agents.md) | 让 LLM 调用自定义工具 | 2 天 |
| 6 | 服务化部署 | [06-langserve-and-deployment.md](06-langserve-and-deployment.md) | 把链暴露为 HTTP API | 1 天 |

## 学习方法建议

1. **读文档 → 写代码 → 跑通 → 改参数**：每个章节先读概念，再在 `notebooks/` 新建 `0x_主题.ipynb` 亲手实现，跑通后尝试改动参数观察差异。
2. **善用 LangSmith**：进阶时开启 `LANGCHAIN_TRACING_V2=true`，在可视化界面看每次调用的输入/输出/耗时，建立"可观测"的工程直觉。
3. **做最小改动实验**：例如把 `gpt-4o-mini` 换成 `gpt-4o`，对比效果与成本；把 Chroma 换成 FAISS，理解抽象层的可替换性。
4. **记录坑点**：在对应 notebook 的 Markdown 单元格里写下你踩过的坑，这是比代码更宝贵的学习资产。

## 里程碑（自检清单）

- [ ] 能用 `ChatOpenAI` 完成一次对话
- [ ] 能用 `PromptTemplate` 动态构造提示词
- [ ] 能用 LCEL（`|` 管道）把"提示词→模型→输出解析"串成一条链
- [ ] 能实现带历史记忆的多轮对话
- [ ] 能对一个 PDF/Markdown 做切分、向量化并回答相关问题（RAG）
- [ ] 能定义工具并让 Agent 自主选择调用
- [ ] 能用 LangServe 把一条链发布为 API

完成以上里程碑，即具备独立开发 LangChain 应用的能力。
