# Observability

> This chapter explains "how to see what happens in an LLM call" — a key step in upgrading a demo to a maintainable system.

## 1. Why Observability

Behind a single `chain.invoke()` may nest:

```
User question
  └─ ChatPromptTemplate
      └─ ChatOpenAI (external HTTP)
          └─ StrOutputParser
```

When anything fails (rate limit, token overflow, parsing error), it's hard to see directly. Observability tools expand these **nested calls into a timeline**, and record each step's input / output / latency / cost.

## 2. LangSmith Intro

LangChain's official offering, **free tier is enough**.

### 2.1 Sign up & get API key

1. Open <https://smith.langchain.com>
2. Log in with a GitHub account
3. Go to **Settings → API Keys → Create API Key**

### 2.2 Configure environment variables

Add the following to `.env`:

```ini
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_pt_xxxxxxxxxxxxxxxxxxxxxxxx
LANGCHAIN_PROJECT=langchain-study    # optional, specifies a project
```

> `LANGCHAIN_TRACING_V2=true` is the switch; turning it off has no side effects.

### 2.3 Re-run the example

```bash
python examples/02_chains.py
```

After it runs, go to <https://smith.langchain.com/o/default/projects/p/langchain-study> to see:

- **Timeline**: start and end of every Runnable's call
- **Input / output**: actual data for each step
- **Metadata**: model name, tokens, latency
- **Errors**: full traceback for rate limit, timeout, parse exceptions

## 3. Local Alternative: Custom Callbacks

If you don't want to send data externally, you can use LangChain's callback system for lightweight tracing:

```python
from langchain_core.tracers import ConsoleCallbackHandler

chain.invoke({"question": "..."}, config={"callbacks": [ConsoleCallbackHandler()]})
```

Or write logs in a custom callback:

```python
from langchain_core.callbacks import BaseCallbackHandler

class FileLogger(BaseCallbackHandler):
    def on_chain_end(self, outputs, **kwargs):
        with open("logs/runs.log", "a", encoding="utf-8") as f:
            f.write(f"{outputs}\n")

chain.invoke(..., config={"callbacks": [FileLogger()]})
```

## 4. Key Metrics

In production, monitor at least:

| Metric | Meaning | Collection |
| --- | --- | --- |
| Call count | Business volume | LangSmith dashboard / self-built |
| Avg / percentile latency | Performance | LangSmith / Prometheus |
| Token consumption | Cost | LangSmith / `get_openai_callback` |
| Error rate | Stability | Filter `status=error` in LangSmith |
| Cache hit rate | Optimization effect | Self-built (cache hit / total) |

## 5. Debug Tips

### 5.1 Print what the retriever fetched

```python
docs = retriever.invoke("What is LangChain?")
for d in docs:
    print("---")
    print(d.page_content)
```

### 5.2 Print the prompt's actual rendered result

```python
prompt_value = prompt.invoke({"question": "..."})
print(prompt_value.to_string())
```

### 5.3 Force LangChain to print internal traceback

```python
import langchain
langchain.debug = True
```

## 6. References

- [LangSmith official docs](https://docs.smith.langchain.com)
- [LangChain Callbacks](https://python.langchain.com/docs/how_to/callbacks/)
- [LangChain Debug](https://python.langchain.com/docs/how_to/debugging/)
