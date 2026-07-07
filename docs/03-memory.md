# 03 · 记忆（Memory）

> 🌐 **English version**: [03-memory.en.md](03-memory.en.md)

真实对话需要上下文。本章学习如何让链"记住"历史消息，实现多轮连贯对话。

## 本章目标

- 理解对话历史在 LangChain 中的表示方式（`messages` 列表）。
- 掌握 `RunnableWithMessageHistory` 给链挂载记忆。
- 了解不同记忆存储后端（内存、文件、数据库）。

## 核心概念

### 1. 消息历史

LangChain 用消息对象（System / Human / AI）记录对话。记忆的本质，就是**在每次调用时把历史消息拼进提示词**。

### 2. 给链加记忆

现代做法是用 `RunnableWithMessageHistory` 包裹你的 LCEL 链，并提供一个"根据 session_id 取历史"的函数。这样：

- 每次调用自动带上该会话的历史；
- 模型回复后自动写回历史。

### 3. 存储后端

- **内存（`InMemoryChatMessageHistory`）**：最简单，重启即丢失，适合练习。
- **文件 / SQLite / Redis**：持久化，适合真实应用。
- 关键点是"按 `session_id` 隔离不同用户的对话"。

### 4. 记忆管理

- 历史过长会超出模型上下文窗口，需要考虑"截断"或"摘要压缩"。
- 可只保留最近 N 条，或定期把旧对话总结成一段摘要。

## 练习任务

1. 用 `InMemoryChatMessageHistory` 实现多轮对话，验证"后面轮次能引用前面信息"。
2. 用不同 `session_id` 验证会话相互隔离。
3. 实现一个"只保留最近 3 轮"的截断策略。

## 常见坑

- 忘记在链里传入/读取 `session_id`，导致所有用户共享同一段历史。
- 历史无限增长导致 token 超限或费用暴涨——务必做截断/摘要。
- 把敏感对话明文落盘，注意数据安全与合规。

## 延伸阅读

- LangChain 官方 "Memory" / "How to add message history" 文档。
- 向量化长期记忆（把旧对话存入向量库按需检索）进阶玩法。
