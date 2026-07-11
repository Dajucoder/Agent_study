"""P32 · _common/llm.py 单元测试（无需真实 API 调用）

验证 get_llm / get_embeddings 的缺省值与显式覆盖逻辑。
注意：langchain 的 ChatOpenAI / OpenAIEmbeddings 并不把 timeout 暴露为直接属性，
因此这里只校验可访问的 model_name / temperature / max_retries / model；
timeout 的「未传时读 .env」分支仍被执行，覆盖相应代码路径。
"""
import pytest

from _common.llm import get_embeddings, get_llm


def test_get_llm_defaults(monkeypatch):
    for v in ("OPENAI_MODEL", "OPENAI_TEMPERATURE", "OPENAI_TIMEOUT", "OPENAI_MAX_RETRIES"):
        monkeypatch.delenv(v, raising=False)
    llm = get_llm()
    assert llm.model_name == "gpt-4o-mini"
    assert llm.temperature == 0.7
    assert llm.max_retries == 2


def test_get_llm_explicit_overrides(monkeypatch):
    llm = get_llm(model="gpt-4o", temperature=0, timeout=10, max_retries=5)
    assert llm.model_name == "gpt-4o"
    assert llm.temperature == 0
    assert llm.max_retries == 5


def test_get_llm_model_from_env(monkeypatch):
    monkeypatch.setenv("OPENAI_MODEL", "my-model")
    assert get_llm().model_name == "my-model"


def test_get_embeddings_default(monkeypatch):
    for v in ("OPENAI_EMBEDDING_MODEL", "OPENAI_EMBEDDING_TIMEOUT"):
        monkeypatch.delenv(v, raising=False)
    emb = get_embeddings()
    assert emb.model == "text-embedding-3-small"


def test_get_embeddings_explicit(monkeypatch):
    emb = get_embeddings(model="e3", timeout=15)
    assert emb.model == "e3"
