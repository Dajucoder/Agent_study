"""P32 · _common/io.py 单元测试（format_docs 边界）"""
from langchain_core.documents import Document

from _common.io import format_docs


def test_format_docs_single():
    docs = [Document(page_content="A")]
    assert format_docs(docs) == "A"


def test_format_docs_join_with_double_newline():
    docs = [Document(page_content="A"), Document(page_content="B")]
    assert format_docs(docs) == "A\n\nB"


def test_format_docs_empty_content_boundary():
    # 空内容文档也应被原样拼接（不抛错）
    docs = [
        Document(page_content=""),
        Document(page_content="X"),
    ]
    assert format_docs(docs) == "\n\nX"


def test_format_docs_empty_list():
    assert format_docs([]) == ""
