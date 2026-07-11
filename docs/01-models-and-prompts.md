# 01 · 模型与提示词（Model I/O）

> 🌐 **English version**: [01-models-and-prompts.en.md](/en/01-models-and-prompts/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [📚 学习路线](LEARNING_GUIDE.md) · 下一章：[02 链（LCEL）](02-chains.md) · 相关：[ENV_SETUP 环境搭建](ENV_SETUP.md) · [03 记忆](03-memory.md)
>
> 🏷️ **难度**：入门 · **时长**：约 20 分钟 · **前置**：[环境搭建](ENV_SETUP.md)

LangChain 中最底层、也是最重要的抽象就是 **Model I/O**：如何把"提示词"喂给"模型"，再把"模型输出"解析成你想要的格式。

## 本章目标

- 理解 LangChain 的模型类型（LLM / ChatModel / 嵌入模型）。
- 掌握 `PromptTemplate` 与 `ChatPromptTemplate` 的动态构造。
- 学会用 `StrOutputParser` / `PydanticOutputParser` 解析输出。

## 核心概念

### 1. 模型（Models）

- **LLM**：接收字符串、返回字符串的早期接口（如旧版 `OpenAI`）。
- **ChatModel**：面向"消息列表"的对话模型（如 `ChatOpenAI`），是当前主流用法。
- **Embedding 模型**：把文本变成向量，用于后面的检索/RAG。

关键认知：**模型是有状态的外部服务，LangChain 只是它的"统一驱动层"**。换模型（OpenAI ↔ 本地模型）通常只需换一行构造参数。

### 2. 提示词模板（Prompts）

硬编码提示词不利于复用。LangChain 用模板把"可变部分"参数化：

- `PromptTemplate`：单段文本模板，适合简单任务。
- `ChatPromptTemplate`：由多条 `System / Human / AI` 消息组成的模板，更贴近真实对话。

模板变量通过 `.format()` 或链式调用传入。

### 3. 输出解析（Output Parsers）

模型返回的是文本，工程里常需要结构化结果：

- `StrOutputParser`：最常用，把消息转成字符串。
- `PydanticOutputParser` / `JsonOutputParser`：把输出解析成 JSON 或 Pydantic 对象，便于后续程序消费。

## 练习任务

1. 用 `ChatOpenAI` 完成一次"翻译一句话"的调用。
2. 用 `ChatPromptTemplate` 构造"你是一个 XX 角色，请对用户说：{input}"的模板并填入不同输入。
3. 用 `PydanticOutputParser` 让模型返回固定字段（如 `{"language": ..., "text": ...}`）。

## 常见坑

- 模板变量名拼错会导致运行时才报错，建议先用 `.format()` 打印检查。
- 模型是远程调用，注意异常（限流、超时、鉴权），练习时可加 `try/except`。
- 不要往提示词里塞密钥或隐私数据。

## 延伸阅读

- LangChain 官方 "Model I/O" 文档（Prompts / Chat Models / Output Parsers）。
- OpenAI 官方提示工程指南（Prompt Engineering）。
