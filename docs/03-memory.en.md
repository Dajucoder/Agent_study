# 03 · Memory

> 🌐 **中文版**: [03-memory.md](03-memory.md)
>
> 🧭 **Navigate** · [🏠 Home](/en/index/) · [📚 Learning Path](/en/LEARNING_GUIDE/) · Prev：[02 Chains (LCEL)](/en/02-chains/) · Next：[04 Retrieval & RAG](/en/04-retrieval-and-rag/) · Related：[02 Chains (LCEL)](/en/02-chains/) · [04 Retrieval & RAG](/en/04-retrieval-and-rag/)
>
> 🏷️ **Level**: Easy · **Time**: ~25 min · **Prereq**: [02 Chains (LCEL)](/en/02-chains/)

Real conversations need context. This chapter learns how to make a chain "remember" history, enabling coherent multi-turn dialog.

## Goals

- Understand how conversation history is represented in LangChain (the `messages` list).
- Master `RunnableWithMessageHistory` to attach memory to a chain.
- Learn about different memory backends (in-memory, file, database).

## Core Concepts

### 1. Message History

LangChain uses message objects (System / Human / AI) to record dialog. The essence of memory is **splicing the history messages into the prompt at every call**.

### 2. Add Memory to a Chain

The older approach is to wrap your LCEL chain with `RunnableWithMessageHistory`, and provide a function that takes a `session_id` and returns the history. This way:

- Each call automatically carries that session's history.
- The model's reply is automatically written back to history.

> ⚠️ `RunnableWithMessageHistory` is **deprecated** in langchain 1.x (still works, emits a warning).
> New projects should use **LangGraph**'s `StateGraph` + `MemorySaver` (see Section 5 / `examples/03_memory_graph.py`).
> The legacy approach is kept only for comparison in `examples/03_memory_runnable.py`.

### 3. Storage Backends

- **In-memory (`InMemoryChatMessageHistory`)**: simplest; lost on restart — good for learning.
- **File / SQLite / Redis**: persistent; suitable for real applications.
- The key is "isolate different users by `session_id`".

### 4. Memory Management

- History that's too long will exceed the model's context window — consider "truncation" or "summary compression".
- You can keep only the latest N turns, or periodically summarize old conversations into a single summary.

## Exercises

1. Use `InMemoryChatMessageHistory` to implement multi-turn dialog, verifying that "later turns can reference earlier information".
2. Verify session isolation with different `session_id`s.
3. Implement a "keep only the latest 3 turns" truncation strategy.

## Common Pitfalls

- Forgetting to pass / read `session_id` in the chain, causing all users to share the same history.
- Unbounded history growth leads to token overflow or runaway costs — always truncate or summarize.
- Sensitive conversations stored in plaintext — be mindful of data security and compliance.

## 5. Advanced: LangGraph style (recommended in 1.x)

`RunnableWithMessageHistory` is convenient but deprecated. LangGraph manages multi-turn messages with a "state graph" and is the 1.x-recommended memory solution:

- `MessagesState` carries the `messages` list; new messages returned by a node are auto-appended to history.
- A checkpointer (`MemorySaver` for in-memory, `SqliteSaver`, etc.) isolates sessions by `thread_id` (the 1.x equivalent of `session_id`).
- Drop your LCEL chain into one node — no hand-written "get/set history" function needed.

Corresponding examples:

- `examples/03_memory_graph.py` — the recommended LangGraph version (`make run-03` runs this by default).
- `examples/03_memory_runnable.py` — legacy comparison only.

## Further Reading

- LangChain "Memory" / "How to add message history" docs.
- Vectorizing long-term memory (storing old conversations in a vector store and retrieving on demand) — advanced.
