"""_common.llm · LLM / Embeddings 工厂

- 默认模型来自 .env 的 OPENAI_MODEL（缺省 gpt-4o-mini）
- OPENAI_API_BASE 已自动读取（兼容第三方 OpenAI 风格服务）
- 延迟导入 langchain_openai：让 _common 在没装 langchain 时也能被部分静态工具加载
"""
from __future__ import annotations

from _common.env import get_env


def get_llm(model: str | None = None, **kwargs):
    """构造 ChatOpenAI 实例。"""
    from langchain_openai import ChatOpenAI  # 延迟导入

    model_name = model or get_env("OPENAI_MODEL", "gpt-4o-mini")
    return ChatOpenAI(model=model_name, **kwargs)


def get_embeddings(model: str | None = None, **kwargs):
    """构造 OpenAIEmbeddings 实例。"""
    from langchain_openai import OpenAIEmbeddings  # 延迟导入

    model_name = model or get_env("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    return OpenAIEmbeddings(model=model_name, **kwargs)
