"""测试 RAG 链中的 format_docs：多份 Document 用 \\n\\n 拼接 page_content。"""
from langchain_core.documents import Document

from _common import format_docs


def test_format_docs_joins_with_double_newline():
    docs = [
        Document(page_content="第一段"),
        Document(page_content="第二段"),
    ]
    assert format_docs(docs) == "第一段\n\n第二段"


def test_format_docs_empty_list():
    assert format_docs([]) == ""
