"""P37 · 10_rag_eval.py 离线测试

不连真实 LLM：用 FakeEmbeddings 建向量库，用 StubChatModel 让答案必然命中关键词，
验证 evaluate_context_recall 的结构与命中计数逻辑；并确认 RAGAS 缺失时优雅降级。
"""
from langchain_community.vectorstores import Chroma
from langchain_core.embeddings import FakeEmbeddings

from _helpers import StubChatModel, load_example

_SAMPLE = [
    "LangChain 是用于构建大语言模型（LLM）应用的开发框架。",
    "核心抽象包括 Model I/O、Chains、Memory、Retrieval 和 Agents。",
    "LCEL 用管道符 | 组合各个组件，每个组件都是 Runnable。",
    "通过 LangServe 将链发布为 HTTP 服务。",
    "通过 LangSmith 进行链路追踪与可观测。",
]


def test_10_context_recall_offline(tmp_path):
    mod = load_example("10_rag_eval.py")

    embeddings = FakeEmbeddings(size=128)
    vectorstore = Chroma.from_texts(
        _SAMPLE, embedding=embeddings, persist_directory=str(tmp_path)
    )
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    # 假模型让答案必然包含全部期望关键词
    fake_llm = StubChatModel(
        responses=["框架 LLM Model I/O LCEL LangServe LangSmith"]
    )

    result = mod.evaluate_context_recall(fake_llm, retriever, mod.EVAL_DATASET)
    assert result["total"] == 5
    assert result["hits"] == 5
    assert result["rate"] == 1.0
    assert len(result["details"]) == 5


def test_10_ragas_unavailable_graceful():
    mod = load_example("10_rag_eval.py")
    # 环境未装 ragas，应返回 None 且不抛异常
    out = mod.evaluate_with_ragas(None, None, mod.EVAL_DATASET)
    assert out is None


def test_10_dataset_shape():
    mod = load_example("10_rag_eval.py")
    assert len(mod.EVAL_DATASET) == 5
    for item in mod.EVAL_DATASET:
        assert "question" in item and "expected_keywords" in item
        assert isinstance(item["expected_keywords"], list)
