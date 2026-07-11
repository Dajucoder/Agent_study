# 01 · Models & Prompts (Model I/O)

> 🌐 **中文版**: [01-models-and-prompts.md](01-models-and-prompts.md)
>
> 🧭 **Navigate** · [🏠 Home](/en/index/) · [📚 Learning Path](/en/LEARNING_GUIDE/) · Next：[02 Chains (LCEL)](/en/02-chains/) · Related：[ENV_SETUP](/en/ENV_SETUP/) · [03 Memory](/en/03-memory/)
>
> 🏷️ **Level**: Beginner · **Time**: ~20 min · **Prereq**: [ENV_SETUP](/en/ENV_SETUP/)

The most fundamental abstraction in LangChain is **Model I/O**: how to feed a "prompt" to a "model" and parse the "model output" into the format you want.

## Goals

- Understand the LangChain model types (LLM / ChatModel / Embedding).
- Master dynamic construction with `PromptTemplate` and `ChatPromptTemplate`.
- Learn to parse output with `StrOutputParser` / `PydanticOutputParser`.

## Core Concepts

### 1. Models

- **LLM**: takes a string, returns a string — the early interface (e.g. legacy `OpenAI`).
- **ChatModel**: a "message-list"-oriented chat model (e.g. `ChatOpenAI`) — the current mainstream.
- **Embedding model**: turns text into vectors, used for retrieval / RAG.

Key insight: **the model is a stateful external service; LangChain is just its "unified driver layer"**. Swapping models (OpenAI ↔ local) usually only changes one constructor parameter.

### 2. Prompts

Hard-coding prompts is hard to reuse. LangChain uses templates to parameterize the "variable parts":

- `PromptTemplate`: a single-string template for simple tasks.
- `ChatPromptTemplate`: a template composed of multiple `System / Human / AI` messages, closer to real conversations.

Template variables are filled in via `.format()` or chain invocations.

### 3. Output Parsers

The model returns text, but engineering often needs structured results:

- `StrOutputParser`: the most common; converts a message to a string.
- `PydanticOutputParser` / `JsonOutputParser`: parses output into JSON or Pydantic objects, for downstream code to consume.

## Exercises

1. Use `ChatOpenAI` to do a "translate a sentence" call.
2. Use `ChatPromptTemplate` to build a template "You are an XX role, say to the user: {input}" and fill in different inputs.
3. Use `PydanticOutputParser` to make the model return fixed fields (e.g. `{"language": ..., "text": ...}`).

## Common Pitfalls

- Misspelling a template variable name raises an error only at runtime — try `.format()` first to print and check.
- Models are remote calls — pay attention to exceptions (rate limits, timeouts, auth); wrap with `try/except` in practice.
- **Never put secrets or PII into prompts**.

## Further Reading

- LangChain "Model I/O" docs (Prompts / Chat Models / Output Parsers).
- OpenAI Prompt Engineering Guide.
