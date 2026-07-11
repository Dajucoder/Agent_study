# 术语表（Glossary）

> 🌐 **English version**: [GLOSSARY.en.md](/en/GLOSSARY/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [参考资料](REFERENCES.md) · 相关：[01 模型与提示词](01-models-and-prompts.md) · [04 检索与 RAG](04-retrieval-and-rag.md)
>
> 🏷️ **类型**：术语速查 · **时长**：随时查阅 · **前置**：无

> 学习中可能遇到的名词解释。**不要求一次全懂**——遇到不熟的词回来查就行。

## 基础概念

| 术语 | 解释 |
| --- | --- |
| **LLM** | Large Language Model，大语言模型。能够理解和生成自然语言的大型神经网络。 |
| **Prompt** | 提示词，输入给 LLM 的文本。 |
| **Token** | 模型处理的最小语义单位。中文约 1 字符 = 1~2 token，英文约 1 单词 = 1~2 token。 |
| **Context Window** | 上下文窗口，单次调用能处理的最大 token 数。 |
| **Embedding** | 嵌入，把文本映射为一个高维向量，便于相似度计算。 |
| **Vector Store** | 向量库，专门存储和检索向量的数据库（Chroma、FAISS、Qdrant 等）。 |

## LangChain 核心抽象

| 术语 | 解释 |
| --- | --- |
| **Runnable** | LangChain 中所有可执行组件的统一接口（`invoke` / `stream` / `batch`）。 |
| **LCEL** | LangChain Expression Language，用 `\|` 管道符组合 Runnable 的语法。 |
| **ChatModel** | 接收消息列表、返回 AI 消息的模型（如 `ChatOpenAI`）。 |
| **LLM**（与 LangChain 概念） | LangChain 中"接收字符串、返回字符串"的早期接口，新版推荐用 ChatModel。 |
| **PromptTemplate** | 提示词模板，把可变部分参数化。 |
| **ChatPromptTemplate** | 由多条消息（system / human / ai）组成的模板。 |
| **OutputParser** | 把模型输出解析为字符串、Pydantic 对象、字典等的组件。 |
| **StrOutputParser** | 最简单的 OutputParser，提取消息的 `content`。 |
| **PydanticOutputParser** | 让模型按 Pydantic schema 返回结构化结果。 |
| **Chain** | 链，把多个 Runnable 串起来组合成一个更大的 Runnable。 |
| **Memory** | 记忆，把多轮对话的历史消息维护下来，注入到下一轮提示词中。 |
| **Retriever** | 检索器，给定查询返回相关文档。 |
| **RAG** | Retrieval-Augmented Generation，检索增强生成。先检索再让 LLM 基于检索结果回答。 |
| **Agent** | 代理，让 LLM 自主决定调用哪些工具、按什么顺序完成任务的机制。 |
| **Tool** | 工具，Agent 可以调用的函数。 |
| **Tool Calling** | 工具调用，模型原生支持"输出结构化函数调用参数"的能力。 |
| **AgentExecutor** | Agent 的执行器，负责驱动"思考→行动→观察"循环。 |
| **LangServe** | 把 LangChain Runnable 暴露为 HTTP API 的库。 |
| **LangSmith** | LangChain 官方的可观测与调试平台。 |
| **LangGraph** | LangChain 1.x 推荐的状态化多步骤应用框架。 |

## RAG 进阶

| 术语 | 解释 |
| --- | --- |
| **Chunk** | 文档切分后的一个块。 |
| **Chunk Size** | 每个块的目标大小（按字符或 token 计）。 |
| **Chunk Overlap** | 相邻块之间重叠的部分，避免切分时切断语义。 |
| **Top-k** | 检索时返回最相关的前 k 个块。 |
| **Similarity Search** | 相似度检索，按向量距离找最近的块。 |
| **MMR** | Maximal Marginal Relevance，相关性与多样性的折中检索。 |
| **Re-ranking** | 重排序，对初检结果用更精细的模型再排一次。 |
| **Hybrid Search** | 混合检索，向量检索 + 关键词检索结合。 |
| **Hypothetical Questions** | 假设性问题索引，给每个块预生成几个"可能被问到的问题"，用问题做检索。 |

## Agent 进阶

| 术语 | 解释 |
| --- | --- |
| **ReAct** | Reason + Act，一种"推理—行动"交替的 Agent 范式。 |
| **Function Calling** | 见上"Tool Calling"。 |
| **Max Iterations** | Agent 最大循环步数，防止无限循环。 |
| **Agent Scratchpad** | Agent 的"草稿纸"，把中间步骤累积给模型看。 |
| **Multi-Agent** | 多 Agent 协作，每个 Agent 负责子任务。 |
| **Human-in-the-Loop** | 人在回路，关键决策前先让人审核。 |

## 工程与部署

| 术语 | 解释 |
| --- | --- |
| **Async** | 异步，并发执行多个 I/O 密集型任务。 |
| **Streaming** | 流式输出，逐字返回模型生成的内容（`stream()`）。 |
| **Batch** | 批量调用，并行处理多个输入。 |
| **Rate Limit** | 速率限制，API 对单位时间内的调用次数 / token 数限制。 |
| **Retry** | 重试，失败后自动重新调用。 |
| **Backoff** | 退避，重试时逐步拉长间隔。 |
| **Cache** | 缓存，相同输入直接返回历史结果，省 token 省时间。 |
| **Tracing** | 追踪，把嵌套调用的输入/输出/耗时/费用记录下来（LangSmith）。 |
| **CORS** | 跨域资源共享，浏览器安全策略。 |
| **Health Check** | 健康检查，部署平台用来判断服务是否存活。 |
| **CI / CD** | 持续集成 / 持续部署。 |
| **Semantic Versioning** | 语义化版本号（`MAJOR.MINOR.PATCH`）。 |
| **Conventional Commits** | 约定式提交，提交信息遵循 `type(scope): subject` 格式。 |
