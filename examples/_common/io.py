"""_common.io · 文档 / RAG 工具"""
from __future__ import annotations


def format_docs(docs) -> str:
    """把若干 Document 拼接为单段上下文，用 \\n\\n 分隔。供 RAG 链与测试共用。"""
    return "\n\n".join(d.page_content for d in docs)
