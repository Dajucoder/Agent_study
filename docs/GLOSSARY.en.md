# Glossary

> 🌐 **中文版**: [GLOSSARY.md](GLOSSARY.md)
>
> 🧭 **Navigate** · [🏠 Home](/en/index/) · [REFERENCES](/en/REFERENCES/) · Related：[01 Models & Prompts](/en/01-models-and-prompts/) · [04 Retrieval & RAG](/en/04-retrieval-and-rag/)
>
> 🏷️ **Type**: Glossary · **Time**: on-demand · **Prereq**: none

> Explanations of terms you may encounter while learning. **You don't need to understand them all at once** — look them up here when you meet an unfamiliar term.

## Basics

| Term | Explanation |
| --- | --- |
| **LLM** | Large Language Model. A large neural network that can understand and generate natural language. |
| **Prompt** | The text you input to an LLM. |
| **Token** | The smallest semantic unit a model processes. Chinese: ~1 char = 1~2 tokens; English: ~1 word = 1~2 tokens. |
| **Context Window** | The maximum number of tokens a single call can handle. |
| **Embedding** | A mapping from text to a high-dimensional vector, for similarity computation. |
| **Vector Store** | A database specialized in storing and retrieving vectors (Chroma, FAISS, Qdrant, etc.). |

## LangChain Core Abstractions

| Term | Explanation |
| --- | --- |
| **Runnable** | The unified interface for all executable components in LangChain (`invoke` / `stream` / `batch`). |
| **LCEL** | LangChain Expression Language: syntax for composing Runnables with the `\|` pipe operator. |
| **ChatModel** | A model that takes a list of messages and returns an AI message (e.g. `ChatOpenAI`). |
| **LLM** (LangChain concept) | In LangChain, the "string in, string out" legacy interface; the new version recommends ChatModel. |
| **PromptTemplate** | A prompt template with parameterized variable parts. |
| **ChatPromptTemplate** | A template composed of multiple messages (system / human / ai). |
| **OutputParser** | A component that parses the model's output into strings, Pydantic objects, dicts, etc. |
| **StrOutputParser** | The simplest OutputParser; extracts a message's `content`. |
| **PydanticOutputParser** | Makes the model return structured results following a Pydantic schema. |
| **Chain** | Combines multiple Runnables into a larger Runnable. |
| **Memory** | Maintains the history of multi-turn conversations and injects it into the next prompt. |
| **Retriever** | Given a query, returns relevant documents. |
| **RAG** | Retrieval-Augmented Generation: retrieve first, then have the LLM answer based on retrieval results. |
| **Agent** | A mechanism that lets the LLM autonomously decide which tools to call and in what order. |
| **Tool** | A function that an Agent can call. |
| **Tool Calling** | A model's native ability to "output structured function call parameters". |
| **AgentExecutor** | The executor for an Agent; drives the "think → act → observe" loop. |
| **LangServe** | A library that exposes LangChain Runnables as HTTP APIs. |
| **LangSmith** | LangChain's official observability and debugging platform. |
| **LangGraph** | LangChain 1.x's recommended framework for stateful multi-step applications. |

## RAG Advanced

| Term | Explanation |
| --- | --- |
| **Chunk** | A block after document splitting. |
| **Chunk Size** | The target size of each block (in characters or tokens). |
| **Chunk Overlap** | The overlap between adjacent blocks, to avoid cutting semantics. |
| **Top-k** | The number of most relevant blocks returned during retrieval. |
| **Similarity Search** | Search by vector distance for the nearest blocks. |
| **MMR** | Maximal Marginal Relevance — a balance between relevance and diversity. |
| **Re-ranking** | Re-ranking initial results with a more precise model. |
| **Hybrid Search** | Combination of vector search and keyword search. |
| **Hypothetical Questions** | Indexing by hypothetical questions: pre-generate "questions that may be asked" for each block, then search by question. |

## Agent Advanced

| Term | Explanation |
| --- | --- |
| **ReAct** | Reason + Act: an Agent paradigm that alternates reasoning and action. |
| **Function Calling** | See "Tool Calling" above. |
| **Max Iterations** | The maximum number of Agent loop steps, to prevent infinite loops. |
| **Agent Scratchpad** | The Agent's "scratch paper", accumulating intermediate steps to show the model. |
| **Multi-Agent** | Multi-Agent collaboration, with each Agent handling a sub-task. |
| **Human-in-the-Loop** | A human reviews key decisions before they happen. |

## Engineering & Deployment

| Term | Explanation |
| --- | --- |
| **Async** | Asynchronous, executing multiple I/O-intensive tasks concurrently. |
| **Streaming** | Returning model output piece by piece (`stream()`). |
| **Batch** | Calling in batch, processing multiple inputs in parallel. |
| **Rate Limit** | API's restriction on calls / tokens per unit time. |
| **Retry** | Auto-retry on failure. |
| **Backoff** | Gradually increasing the interval between retries. |
| **Cache** | Returning historical results for identical inputs, saving tokens and time. |
| **Tracing** | Recording nested calls' input / output / latency / cost (LangSmith). |
| **CORS** | Cross-Origin Resource Sharing, a browser security policy. |
| **Health Check** | Used by deployment platforms to determine if a service is alive. |
| **CI / CD** | Continuous Integration / Continuous Deployment. |
| **Semantic Versioning** | Semantic version numbers (`MAJOR.MINOR.PATCH`). |
| **Conventional Commits** | Convention commits, where commit messages follow the `type(scope): subject` format. |
