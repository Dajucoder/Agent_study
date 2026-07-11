"""_common.llm · LLM / Embeddings 工厂

- 默认模型来自 `settings.openai_model`（缺省 gpt-4o-mini），对应 .env 的 OPENAI_MODEL
- `settings.openai_api_base` 已自动透传给 ChatOpenAI / OpenAIEmbeddings
  （兼容第三方 OpenAI 风格服务）
- 运行时参数（temperature / timeout / max_retries）未显式传时，从 settings 读取，
  缺省 0.7 / 30 / 2；显式传参优先级最高。
- 延迟导入 langchain_openai：让 _common 在没装 langchain 时也能被部分静态工具加载
"""
from __future__ import annotations

from _common.settings import Settings


def get_llm(
    model: str | None = None,
    *,
    temperature: float | None = None,
    timeout: int | None = None,
    max_retries: int | None = None,
    **kwargs,
):
    """构造 ChatOpenAI 实例。

    temperature / timeout / max_retries 未传时读 `Settings`
    （OPENAI_TEMPERATURE / OPENAI_TIMEOUT / OPENAI_MAX_RETRIES，缺省 0.7 / 30 / 2）。
    每次调用重新实例化 Settings，以反映运行期环境变量（含 monkeypatch 测试）。
    """
    from langchain_openai import ChatOpenAI  # 延迟导入

    s = Settings()
    model_name = model or s.openai_model
    if temperature is None:
        temperature = s.openai_temperature
    if timeout is None:
        timeout = s.openai_timeout
    if max_retries is None:
        max_retries = s.openai_max_retries
    # 仅当显式配置了 base_url 时才透传，避免把 None 传给 SDK
    if s.openai_api_base:
        kwargs["openai_api_base"] = s.openai_api_base
    return ChatOpenAI(
        model=model_name,
        temperature=temperature,
        timeout=timeout,
        max_retries=max_retries,
        **kwargs,
    )


def get_embeddings(
    model: str | None = None,
    *,
    timeout: int | None = None,
    **kwargs,
):
    """构造 OpenAIEmbeddings 实例。

    timeout 未传时读 `Settings.openai_embedding_timeout`，缺省 30。
    """
    from langchain_openai import OpenAIEmbeddings  # 延迟导入

    s = Settings()
    model_name = model or s.openai_embedding_model
    if timeout is None:
        timeout = s.openai_embedding_timeout
    if s.openai_api_base:
        kwargs["openai_api_base"] = s.openai_api_base
    return OpenAIEmbeddings(model=model_name, timeout=timeout, **kwargs)
