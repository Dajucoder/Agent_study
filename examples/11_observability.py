"""11 · 可观测性实战（Observability in practice）

把 docs/OBSERVABILITY.md 的概念落到可跑代码：

- 段 1：用 `get_openai_callback` 统计一次调用的 token 与花费
- 段 2：LangSmith tracing 引导（开关在 `.env` 的 `LANGCHAIN_TRACING_V2`）
- 段 3：OpenTelemetry 导出到 OTLP 端点（可选，需 `opentelemetry` 相关包）

运行：python examples/11_observability.py
"""
from __future__ import annotations

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

from _common import check_api_key, get_llm


def demo_token_count(llm=None):
    """段 1：用 get_openai_callback 统计一次调用的 token / 花费。

    返回 {total_tokens, total_cost, prompt_tokens, completion_tokens}；
    langchain_community 缺失时返回 None。
    """
    if llm is None:
        llm = get_llm()
    try:
        from langchain_community.callbacks import get_openai_callback
    except ImportError:
        print("⚠️ langchain_community 未安装，跳过 token 统计")
        return None

    chain = ChatPromptTemplate.from_template("{q}") | llm | StrOutputParser()
    with get_openai_callback() as cb:
        chain.invoke({"q": "用一句话介绍 LangChain。"})
        print(
            f"✓ 调用完成：Total Tokens={cb.total_tokens}  "
            f"Cost(USD)={cb.total_cost:.6f}  "
            f"Prompt={cb.prompt_tokens}  Completion={cb.completion_tokens}"
        )
        return {
            "total_tokens": cb.total_tokens,
            "total_cost": cb.total_cost,
            "prompt_tokens": cb.prompt_tokens,
            "completion_tokens": cb.completion_tokens,
        }


def demo_langsmith_tracing(llm=None):
    """段 2：若已开启 LANGCHAIN_TRACING_V2，调用会被自动追踪到 smith.langchain.com。"""
    import os

    enabled = (os.getenv("LANGCHAIN_TRACING_V2", "false").lower() == "true")
    print(f"LangSmith tracing：{'开启' if enabled else '未开启'}")
    if not enabled:
        print("  提示：在 .env 设置 LANGCHAIN_TRACING_V2=true 后重跑即可看到链路。")
        return
    if llm is None:
        llm = get_llm()
    chain = ChatPromptTemplate.from_template("{q}") | llm | StrOutputParser()
    chain.invoke({"q": "用一句话介绍 LangChain。"})
    print("✓ 已发送一次调用，去 https://smith.langchain.com 查看链路。")


def demo_otel():
    """段 3：配置 OpenTelemetry TracerProvider + OTLP 导出器（可选）。

    默认把 span 发往 http://localhost:4318（OTLP HTTP），可用 Jaeger / Tempo 接收。
    仅当 opentelemetry 相关包可用时启用，否则优雅提示。
    """
    try:
        from opentelemetry import trace
        from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
            OTLPSpanExporter,
        )
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor
    except ImportError as e:
        print(f"⚠️ 未安装 opentelemetry，跳过 OTel 段：{e}")
        print(
            "  安装：pip install opentelemetry-api opentelemetry-sdk "
            "opentelemetry-exporter-otlp"
        )
        return None

    resource = Resource.create({"service.name": "agent-study"})
    provider = TracerProvider(resource=resource)
    exporter = OTLPSpanExporter(endpoint="http://localhost:4318/v1/traces")
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)
    tracer = trace.get_tracer("agent-study")
    with tracer.start_as_current_span("observability-demo") as span:
        span.set_attribute("langchain.component", "observability-demo")
    print(
        "✓ OpenTelemetry TracerProvider 已配置，span 已生成"
        "（默认发往 http://localhost:4318）。"
    )
    return provider


def main():
    check_api_key()
    llm = get_llm()

    print("\n=== 段 1：token / 花费统计 ===")
    demo_token_count(llm)

    print("\n=== 段 2：LangSmith 链路追踪 ===")
    demo_langsmith_tracing(llm)

    print("\n=== 段 3：OpenTelemetry 导出（可选）===")
    demo_otel()


if __name__ == "__main__":
    main()
