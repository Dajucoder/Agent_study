# 04 · 检索与 RAG（Retrieval-Augmented Generation）

> 🌐 **English version**: [04-retrieval-and-rag.en.md](/en/04-retrieval-and-rag/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [📚 学习路线](LEARNING_GUIDE.md) · 上一章：[03 记忆](03-memory.md) · 下一章：[05 代理](05-agents.md) · 相关：[03 记忆](03-memory.md) · [ARCHITECTURE 架构总览](ARCHITECTURE.md)
>
> 🏷️ **难度**：中级 · **时长**：约 30 分钟 · **前置**：[03 记忆](03-memory.md)

**RAG** 让模型基于"你提供的私有文档"回答，而不是只靠训练时记住的知识。这是 LangChain 最主流的应用形态之一。

## 本章目标

- 理解 RAG 全流程：加载 → 切分 → 向量化 → 存储 → 检索 → 生成。
- 能用 Chroma 建立本地向量库并做相似度检索。
- 能拼出一条"检索 + 生成"的 RAG 链。

## 核心概念

### 1. 全流程拆解

1. **Document Loaders**：从 PDF / Markdown / 网页 / 数据库加载文本。
2. **Text Splitters**：把长文档切成合适大小的块（chunk），兼顾语义完整与模型窗口。
3. **Embeddings**：把每个块变成向量。
4. **Vector Store（如 Chroma）**：存储向量，支持"按相似度检索"。
5. **Retriever**：给定问题，从库里取回最相关的若干块。
6. **Generation**：把"相关块 + 问题"塞进提示词，让模型基于文档作答，并尽量标注来源。

### 2. 为什么要切分

模型有上下文上限，且过长的文本检索不精准。合理切分（如 500 字符、重叠 50 字符）能提升相关性。

### 3. 检索质量决定上限

RAG 效果 ≈ 检索质量 × 生成质量。应关注：
- 切分策略是否保留语义边界；
- 嵌入模型是否适合你的语料；
- 检索的块数（top_k）是否合适。

### 4. 提示词要点

生成阶段要明确告诉模型"只根据提供的上下文回答，不知道就说不知道"，减少幻觉。

## 练习任务

1. 准备一个 `data/docs/` 下的 Markdown 文件，完成加载与切分。
2. 用 `OpenAIEmbeddings` + `Chroma` 建立向量库（持久化到 `data/chroma/`）。
3. 实现 `retriever`，对一个问题返回 top-3 相关块。
4. 拼出 RAG 链：检索结果注入提示词 → 模型生成带"来源"的回答。

## 常见坑

- 没做持久化，每次都重建向量库，浪费 token 与时间（Chroma 支持 `persist_directory`）。
- chunk 太大/太小导致检索不准；先用默认参数，再调。
- 直接信任模型"编造"的引用；练习时打印实际检索到的块做核对。

## 进阶：评估

跑通 RAG 只是第一步；改了切分大小、检索 top_k、prompt 后，你往往想知道"效果是变好还是变差"。

### 1. 自建"上下文命中率"

不依赖任何评估框架：准备若干 `{"question": ..., "expected_keywords": [...]}`，
跑 RAG 链后断言答案中**至少出现 1 个**期望关键词；命中率过低说明检索到的上下文不足以支撑回答。

完整实现见 [examples/10_rag_eval.py](../examples/10_rag_eval.py)：

- 段 1：对 5 个样本统计命中率，低于 4/5 给出调参建议；
- 段 2（可选）：安装 `ragas` 后做 faithfulness / answer_relevancy 评估，未安装时优雅降级。

### 2. 进阶评估指标

- 忠实度（Faithfulness）：答案是否完全基于检索到的上下文，有无编造；
- 答案相关性（Answer Relevancy）：答案是否切题；
- 上下文相关性（Context Relevancy）：检索到的块是否真的有用。

可用 [RAGAS](https://docs.ragas.io/) 等框架自动化上述指标。

## 进阶检索技术（Re-ranking / Hybrid Search）

04 的 demo 只用"向量相似度"做检索，真实语料里这往往不够。

### 1. 混合检索（Hybrid Search）

纯向量检索擅长"语义相近"，但遇到**字面关键词**（型号、代码、专有名词）容易漏检。
混合检索把两路召回融合：

- **向量检索**：语义匹配（已有，Chroma 默认）。
- **关键词检索（BM25）**：字面匹配，用 [`langchain_community.retrievers.BM25Retriever`](https://python.langchain.com/docs/integrations/retrievers/bm25/)。
- **融合**：用 [`EnsembleRetriever`](https://python.langchain.com/docs/integrations/retrievers/ensemble/) 给两路加权（`weights=[0.5, 0.5]`），再 `Reciprocal Rank Fusion` 合并。

### 2. 重排序（Re-ranking）

精度提升**性价比最高**的一步：先多召回（如 top-20），再用 Cross-Encoder 对候选重新打分、取最相关的前 k（如 top-5）。

- 本地：`sentence-transformers` 的 `CrossEncoder`（如 `cross-encoder/ms-marco-MiniLM-L-6-v2`）。
- 托管：[Cohere Rerank API](https://docs.cohere.com/docs/rerank)；LangChain 有 [`CohereRerank`](https://python.langchain.com/docs/integrations/document_compressors/cohere_rerank/) 文档压缩器可直接挂到 `retriever`。

典型链路：`retriever(top_k=20) → CrossEncoderRerank(top_n=5) → LLM`。

### 3. 父子文档检索（Parent-Child）

切分时**小块**用于 embedding/检索（更精准），命中后回链到**大块**喂给 LLM（上下文更完整）。
LangChain 提供 [`InParentDocumentRetriever`](https://python.langchain.com/docs/integrations/retrievers/parent_document/)。

> 以上均不附完整代码（避免仓库膨胀）；概念稳定后建议直接看官方文档落地。

## 延伸阅读

- LangChain 官方 "RAG" 教程与 "Retrieval" 模块文档。
- 进阶：混合检索（向量 + 关键词）、重排序（Re-ranking）、父子文档检索。
