# 成本与限制（Cost & Limits）

> 本章集中说明 LLM 调用可能产生的**费用、超时、速率限制**以及**省钱策略**。
> 不论是 OpenAI 官方还是第三方 OpenAI 兼容服务，养成"看 token、知速率、设上限"的习惯都至关重要。

## 1. 费用组成

一次 LLM 调用由两部分计费：

| 项 | 说明 | 影响因素 |
| --- | --- | --- |
| **输入 token** | 提示词 + 历史消息 + 检索文档 | 提示词长度、文档切分粒度 |
| **输出 token** | 模型生成的回答 | `max_tokens`、输出风格 |

### 估算公式

```
总费用 = (输入 token × 输入单价) + (输出 token × 输出单价)
```

### 参考价目（2026 年 7 月，仅供参考）

| 模型 | 输入 ($/1M) | 输出 ($/1M) | 备注 |
| --- | --- | --- | --- |
| gpt-4o-mini | 0.15 | 0.60 | 入门首选，性价比高 |
| gpt-4o | 2.50 | 10.00 | 复杂推理、长文本 |
| DeepSeek-V3 / V4-Flash | 极低 | 极低 | 第三方 API 通常 1/10 |
| qwen-turbo / qwen-plus | 低 | 低 | 通义千问，国产 |
| Ollama 本地模型 | 0 | 0 | 仅算电费 |

> 价格随时间变化，请以 [OpenAI 官方价目](https://openai.com/pricing) 为准。

## 2. 控制成本的 5 个开关

### 2.1 选小模型

```python
# 默认已经走 gpt-4o-mini
llm = ChatOpenAI(model="gpt-4o-mini")
```

学习阶段几乎所有 demo 都能用 mini 跑通。

### 2.2 限制输出长度

```python
llm = ChatOpenAI(model="gpt-4o-mini", max_tokens=512)
```

对于"翻译""总结"这类任务，加 `max_tokens=512` 通常够用。

### 2.3 减小上下文

RAG 是大头——检索到的 5 段 1000 字符 ≈ 5000 token，约 $0.001 一次。

```python
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})  # 改为 2 而非默认 4
```

### 2.4 缓存重复调用

```python
from langchain_core.globals import set_llm_cache
from langchain_community.cache import InMemoryCache

set_llm_cache(InMemoryCache())  # 同输入直接命中缓存
```

长期项目建议用 [Redis](https://python.langchain.com/docs/integrations/caching/redis_cache_llm/) 或 [SQLite](https://python.langchain.com/docs/integrations/caching/sqlite_cache_llm/)。

### 2.5 监控 token 消耗

```python
from langchain_community.callbacks import get_openai_callback

with get_openai_callback() as cb:
    chain.invoke({"question": "..."})
    print(cb)  # Total Tokens / Total Cost (USD)
```

## 3. 速率限制（Rate Limit）

OpenAI 默认按"每分钟 token"和"每分钟请求数"两个维度限流：

| 等级 | RPM | TPM |
| --- | --- | --- |
| 免费 | 3 | 40,000 |
| Tier 1 | 60 | 60,000 |
| Tier 2 | 5,000 | 1,000,000 |

### 触发 RateLimitError 怎么办？

1. **降低并发**：批量 `chain.batch([...])` 时加 `max_concurrency=2`。
2. **指数退避**：用 `tenacity` 包装：
   ```python
   from tenacity import retry, stop_after_attempt, wait_exponential
   @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
   def safe_invoke(chain, *a, **kw):
       return chain.invoke(*a, **kw)
   ```
3. **换账号 / 升级 tier**：长期使用建议申请更高的 usage tier。

## 4. 超时与网络

```python
llm = ChatOpenAI(
    model="gpt-4o-mini",
    timeout=30,        # 单次请求超时秒数
    max_retries=2,     # 失败自动重试
)
```

## 5. 上下文窗口

| 模型 | 上下文窗口 |
| --- | --- |
| gpt-4o-mini | 128K |
| gpt-4o | 128K |
| DeepSeek-V3 | 64K |
| Ollama qwen2:7b（默认） | 32K |

历史消息过长时**必须截断**或**摘要压缩**：

```python
# 仅保留最近 6 条消息
def trim_history(messages, k=6):
    return messages[-k:]
```

## 6. 检查清单

跑生产前确认：

- [ ] 已设置 `max_tokens`
- [ ] 已设置 `timeout` / `max_retries`
- [ ] 批量场景有并发限制
- [ ] RAG 检索结果有 `k` 上限
- [ ] 关键路径有缓存
- [ ] 已接入 LangSmith / 自建指标，看 token 消耗趋势
