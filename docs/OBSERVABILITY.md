# 可观测性（Observability）

> 🌐 **English version**: [OBSERVABILITY.en.md](/en/OBSERVABILITY/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [ARCHITECTURE 架构总览](ARCHITECTURE.md) · [成本与限制](COST_AND_LIMITS.md) · 相关：[06 服务化与部署](06-langserve-and-deployment.md)
>
> 🏷️ **难度**：进阶 · **时长**：约 15 分钟 · **前置**：[06 服务化与部署](06-langserve-and-deployment.md)

> 本章讲清"如何看一次 LLM 调用发生了什么"——这是把 demo 升级为可维护系统的关键一步。

## 1. 为什么要可观测

一次 `chain.invoke()` 背后可能嵌套：

```
用户问题
  └─ ChatPromptTemplate
      └─ ChatOpenAI（外部 HTTP）
          └─ StrOutputParser
```

任何一环出错（限流、token 超限、解析失败）都很难直接看出来。可观测工具把这些**嵌套调用展开成时间线**，并记录每一步的输入/输出/耗时/费用。

## 2. LangSmith 入门

LangChain 官方出品，**免费层够用**。

### 2.1 注册与获取 API Key

1. 打开 <https://smith.langchain.com>
2. 用 GitHub 账号登录
3. 进入 **Settings → API Keys → Create API Key**

### 2.2 配置环境变量

把以下两行加入 `.env`：

```ini
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_pt_xxxxxxxxxxxxxxxxxxxxxxxx
LANGCHAIN_PROJECT=langchain-study    # 可选，指定项目
```

> `LANGCHAIN_TRACING_V2=true` 是开关；不开启则完全无副作用。

### 2.3 重跑示例

```bash
python examples/02_chains.py
```

跑完后到 <https://smith.langchain.com/o/default/projects/p/langchain-study> 查看：

- **时间线**：每个 Runnable 的调用起止
- **输入/输出**：每一步的实际数据
- **元数据**：模型名、token 数、耗时
- **错误**：限流、超时、解析异常的完整堆栈

## 3. 本地替代：自建回调

不想把数据发到外部时，可以用 LangChain 的 callback 系统做轻量追踪：

```python
from langchain_core.tracers import ConsoleCallbackHandler

chain.invoke({"question": "..."}, config={"callbacks": [ConsoleCallbackHandler()]})
```

或在自定义回调里写日志：

```python
from langchain_core.callbacks import BaseCallbackHandler

class FileLogger(BaseCallbackHandler):
    def on_chain_end(self, outputs, **kwargs):
        with open("logs/runs.log", "a", encoding="utf-8") as f:
            f.write(f"{outputs}\n")

chain.invoke(..., config={"callbacks": [FileLogger()]})
```

## 4. 关键指标

生产环境至少要监控：

| 指标 | 意义 | 收集方式 |
| --- | --- | --- |
| 调用次数 | 业务量 | LangSmith 仪表盘 / 自建指标 |
| 平均/分位耗时 | 性能 | LangSmith / Prometheus |
| Token 消耗 | 成本 | LangSmith / `get_openai_callback` |
| 错误率 | 稳定性 | LangSmith 过滤 status=error |
| 缓存命中率 | 优化效果 | 自建（cache hit / total） |

## 5. Debug 小技巧

### 5.1 打印 retriever 拿到的内容

```python
docs = retriever.invoke("LangChain 是什么？")
for d in docs:
    print("---")
    print(d.page_content)
```

### 5.2 打印 prompt 实际渲染结果

```python
prompt_value = prompt.invoke({"question": "..."})
print(prompt_value.to_string())
```

### 5.3 强制 LangChain 打印内部 traceback

```python
import langchain
langchain.debug = True
```

## 7. 可运行示例

概念落到可跑代码见 [examples/11_observability.py](../examples/11_observability.py)：

- 段 1：用 `get_openai_callback` 统计一次调用的 token 与花费；
- 段 2：LangSmith tracing 引导（开关在 `.env` 的 `LANGCHAIN_TRACING_V2`）；
- 段 3：配置 OpenTelemetry `OTLPSpanExporter`（可选，需 `opentelemetry` 相关包）。

## 6. 参考

- [LangSmith 官方文档](https://docs.smith.langchain.com)
- [LangChain Callbacks](https://python.langchain.com/docs/how_to/callbacks/)
- [LangChain Debug](https://python.langchain.com/docs/how_to/debugging/)
