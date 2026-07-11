# 02 · Chains

> 🌐 **中文版**: [02-chains.md](02-chains.md)
>
> 🧭 **Navigate** · [🏠 Home](/en/index/) · [📚 Learning Path](/en/LEARNING_GUIDE/) · Prev：[01 Models & Prompts](/en/01-models-and-prompts/) · Next：[03 Memory](/en/03-memory/) · Related：[01 Models & Prompts](/en/01-models-and-prompts/) · [04 Retrieval & RAG](/en/04-retrieval-and-rag/)
>
> 🏷️ **Level**: Easy · **Time**: ~25 min · **Prereq**: [01 Models & Prompts](/en/01-models-and-prompts/)

When "prompt → model → parsing" needs to be chained, or multi-step composition is required, use **Chains**. Modern LangChain recommends using **LCEL (LangChain Expression Language)** to compose components with the `|` pipe operator.

## Goals

- Understand the essence of a "chain": composing multiple callables into a larger one.
- Master LCEL's `|` composition and `.invoke()` / `.stream()` / `.batch()`.
- Be able to use `RunnableParallel` / `RunnablePassthrough` for branches and passthrough.

## Core Concepts

### 1. Why Chains

A single model call can't solve complex tasks. For example "summarize a document" = load text → build prompt → call model → parse result. Solidifying these steps into a chain improves both reusability and readability.

### 2. LCEL Pipe

LCEL uses `|` to connect one component's output to the next component's input:

```
prompt | model | output_parser
```

Each component is a `Runnable`, so the chain itself is also a `Runnable` — nestable, reusable.

### 3. Key Runnables

- `RunnablePassthrough`: passes the input through unchanged; commonly used to keep the original field for later steps.
- `RunnableParallel` / dict syntax: runs multiple branches in parallel and merges the results.
- `RunnableLambda`: wraps an ordinary Python function as a link in the chain (format conversion, post-processing).

### 4. Calling Methods

- `.invoke(input)`: single sync call, returns the final result.
- `.stream(input)`: streaming output, suitable for chat scenarios.
- `.batch([...])`: batch calls, improves throughput.

## Exercises

1. Use LCEL to assemble `prompt | model | StrOutputParser`, implementing an "EN→ZH" translation chain.
2. Use `RunnableParallel` to generate both "summary" and "keywords" branches simultaneously.
3. Use `RunnablePassthrough` to preserve the original question while returning the result.
4. Experience the difference between `.stream()` and `.invoke()` outputs.

## Common Pitfalls

- The "input / output field names" in each link must match; mismatched fields are the most common beginner error.
- LCEL chains don't save state by default; for multi-turn context, see the next chapter on Memory.
- Watch API rate limits during `batch`; control concurrency if needed.

## Further Reading

- LangChain "LCEL" docs and Cookbook.
- The `Runnable` interface (invoke / stream / batch / compose).
