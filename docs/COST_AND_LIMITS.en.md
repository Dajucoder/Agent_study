# Cost & Limits

> 🌐 **中文版**: [COST_AND_LIMITS.md](COST_AND_LIMITS.md)

> This chapter focuses on the **cost, timeouts, rate limits** of LLM calls, and **cost-saving strategies**. Whether you use OpenAI or a third-party OpenAI-compatible service, develop the habit of "watch tokens, know rate limits, set caps".

## 1. Cost Components

A single LLM call is billed in two parts:

| Item | Description | Factors |
| --- | --- | --- |
| **Input tokens** | prompt + history + retrieved docs | prompt length, document chunk granularity |
| **Output tokens** | model's generated answer | `max_tokens`, output style |

### Estimation

```
Total cost = (input tokens × input unit price) + (output tokens × output unit price)
```

### Reference Pricing (as of July 2026, for reference only)

| Model | Input ($/1M) | Output ($/1M) | Note |
| --- | --- | --- | --- |
| gpt-4o-mini | 0.15 | 0.60 | Best for getting started, high cost-performance |
| gpt-4o | 2.50 | 10.00 | Complex reasoning, long text |
| DeepSeek-V3 / V4-Flash | very low | very low | Third-party API typically 1/10 |
| qwen-turbo / qwen-plus | low | low | Qwen (China) |
| Ollama local model | 0 | 0 | Only electricity |

> Prices change over time; please refer to [OpenAI's official pricing](https://openai.com/pricing).

## 2. Five Switches to Control Cost

### 2.1 Choose a smaller model

```python
# Default already uses gpt-4o-mini
llm = ChatOpenAI(model="gpt-4o-mini")
```

Almost all demos can be run with `mini` during learning.

### 2.2 Cap output length

```python
llm = ChatOpenAI(model="gpt-4o-mini", max_tokens=512)
```

For tasks like "translation" or "summary", `max_tokens=512` is usually enough.

### 2.3 Reduce context

RAG is the big chunk — 5 chunks of 1000 chars ≈ 5000 tokens, about $0.001 per call.

```python
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})  # Use 2 instead of default 4
```

### 2.4 Cache repeated calls

```python
from langchain_core.globals import set_llm_cache
from langchain_community.cache import InMemoryCache

set_llm_cache(InMemoryCache())  # Same input hits cache directly
```

For long-term projects, use [Redis](https://python.langchain.com/docs/integrations/caching/redis_cache_llm/) or [SQLite](https://python.langchain.com/docs/integrations/caching/sqlite_cache_llm/).

### 2.5 Monitor token consumption

```python
from langchain_community.callbacks import get_openai_callback

with get_openai_callback() as cb:
    chain.invoke({"question": "..."})
    print(cb)  # Total Tokens / Total Cost (USD)
```

## 3. Rate Limits

OpenAI rate-limits by "tokens per minute" and "requests per minute":

| Tier | RPM | TPM |
| --- | --- | --- |
| Free | 3 | 40,000 |
| Tier 1 | 60 | 60,000 |
| Tier 2 | 5,000 | 1,000,000 |

### What to do when RateLimitError triggers?

1. **Lower concurrency**: pass `max_concurrency=2` to `chain.batch([...])`.
2. **Exponential backoff**: wrap with `tenacity`:
   ```python
   from tenacity import retry, stop_after_attempt, wait_exponential
   @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
   def safe_invoke(chain, *a, **kw):
       return chain.invoke(*a, **kw)
   ```
3. **Switch account / upgrade tier**: for long-term use, request a higher usage tier.

## 4. Timeouts & Network

```python
llm = ChatOpenAI(
    model="gpt-4o-mini",
    timeout=30,        # seconds
    max_retries=2,     # auto-retry on failure
)
```

## 5. Context Window

| Model | Context window |
| --- | --- |
| gpt-4o-mini | 128K |
| gpt-4o | 128K |
| DeepSeek-V3 | 64K |
| Ollama qwen2:7b (default) | 32K |

When history is too long, **you must truncate or summarize**:

```python
# Keep only the latest 6 messages
def trim_history(messages, k=6):
    return messages[-k:]
```

## 6. Checklist

Before going to production, confirm:

- [ ] `max_tokens` is set
- [ ] `timeout` / `max_retries` are set
- [ ] Concurrency limit for batch scenarios
- [ ] RAG retrieval has a `k` cap
- [ ] Caching on critical paths
- [ ] Hooked up to LangSmith / self-built metrics for token consumption trends
