# 02 · 链（Chains）

> 🌐 **English version**: [02-chains.en.md](02-chains.en.md)

当"提示词 → 模型 → 解析"需要串联，或需要多步组合时，就用 **链（Chain）**。现代 LangChain 推荐用 **LCEL（LangChain Expression Language）** 以管道符 `|` 组合组件。

## 本章目标

- 理解"链"的本质：把多个可调用对象组合成一个更大的可调用对象。
- 掌握 LCEL 的 `|` 组合与 `.invoke()` / `.stream()` / `.batch()`。
- 能用 `RunnableParallel` / `RunnablePassthrough` 做分支与透传。

## 核心概念

### 1. 为什么需要链

单个模型调用解决不了复杂任务。例如"总结文档"= 加载文本 → 构造提示词 → 调模型 → 解析结果。把这几步固化成一条链，复用性与可读性都更好。

### 2. LCEL 管道

LCEL 用 `|` 把一个组件的输出接到下一个组件的输入：

```
prompt | model | output_parser
```

每个组件都是一个 `Runnable`，因此链本身也是 `Runnable`，可以嵌套、复用。

### 3. 关键 Runnable

- `RunnablePassthrough`：原样透传输入，常用于把原始字段一并传给后续步骤。
- `RunnableParallel` / 字典语法：并行执行多个分支并合并结果。
- `RunnableLambda`：把普通 Python 函数包装成链的一环（做格式转换、后处理）。

### 4. 调用方式

- `.invoke(input)`：单次同步调用，返回最终结果。
- `.stream(input)`：流式输出，适合聊天场景逐字返回。
- `.batch([...])`：批量调用，提升吞吐。

## 练习任务

1. 用 LCEL 拼出 `prompt | model | StrOutputParser`，实现"英文→中文"翻译链。
2. 用 `RunnableParallel` 同时生成"摘要"和"关键词"两个分支。
3. 用 `RunnablePassthrough` 在返回结果的同时保留原始问题。
4. 体验 `.stream()` 与 `.invoke()` 的输出差异。

## 常见坑

- 链中各环节的"输入/输出字段名"要接得上，字段对不上是初学者最常见错误。
- LCEL 链默认不保存状态；需要多轮上下文请看下一章 Memory。
- 批量 `batch` 时注意 API 限流，必要时控制并发数。

## 延伸阅读

- LangChain 官方 "LCEL" 文档与 Cookbook。
- `Runnable` 接口说明（invoke / stream / batch / compose）。
