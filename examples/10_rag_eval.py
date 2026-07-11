"""10 · RAG 评估（Evaluation）

光把 RAG 跑通还不够——改了切分大小、检索 top_k、prompt 后，
你往往想知道"效果是变好还是变差"。本示例给出两种评估方式：

- 段 1（自包含、零依赖）：自建"上下文命中率"。
  准备若干 `{"question": ..., "expected_keywords": [...]}`，
  跑 RAG 链后断言回答中**至少出现 1 个**期望关键词；命中率过低说明
  检索到的上下文不足以支撑回答。
- 段 2（可选）：安装 `ragas` 后做 faithfulness / answer_relevancy 评估。
  未安装时优雅降级，不影响段 1。

复用 `04_rag.py` 的向量库构建逻辑（首次运行会真实 embedding 并落盘 data/chroma）。

运行：python examples/10_rag_eval.py
"""
from __future__ import annotations

import importlib.util
from pathlib import Path

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from _common import (
    check_api_key,
    format_docs,
    get_llm,
)

_HERE = Path(__file__).resolve().parent


def _load_04():
    """懒加载 04_rag 模块，复用其 build_or_load_vectorstore（避免导入期副作用）。"""
    spec = importlib.util.spec_from_file_location("example_04", _HERE / "04_rag.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


# ---- 评估数据集：问题 + 期望在答案中出现的关键词 ----
# 关键词基于 data/docs/sample.txt 原文，命中条件为"答案包含其中任意一个"。
EVAL_DATASET = [
    {
        "question": "LangChain 是什么？",
        "expected_keywords": ["框架", "大语言模型", "LLM", "应用"],
    },
    {
        "question": "LangChain 的核心抽象有哪些？",
        "expected_keywords": ["Model I/O", "Chains", "Memory", "Retrieval", "Agents", "核心抽象"],
    },
    {
        "question": "什么是 LCEL？",
        "expected_keywords": ["LCEL", "管道符", "Runnable", "组合"],
    },
    {
        "question": "如何把一条链发布为服务？",
        "expected_keywords": ["LangServe", "HTTP", "服务"],
    },
    {
        "question": "如何对链做链路追踪与可观测？",
        "expected_keywords": ["LangSmith", "追踪", "可观测"],
    },
]


def build_qa_chain(llm, retriever):
    """拼一条与 04 一致的 RAG 链：retriever -> 上下文 -> 提示词 -> 模型 -> 文本。"""
    prompt = ChatPromptTemplate.from_template(
        "只根据下面的上下文回答，若上下文没有答案就说“我不知道”。\n\n"
        "上下文：\n{context}\n\n问题：{question}"
    )
    return (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )


def run_qa(llm, retriever, question: str) -> str:
    """对单个问题跑 RAG 链，返回模型生成的答案文本。"""
    chain = build_qa_chain(llm, retriever)
    return chain.invoke(question)


def evaluate_context_recall(llm, retriever, dataset) -> dict:
    """段 1：自建"上下文命中率"。

    对每条样本跑 RAG，统计"答案中出现至少 1 个期望关键词"的命中数。
    返回 {total, hits, rate, details}。
    """
    hits = 0
    details = []
    for item in dataset:
        answer = run_qa(llm, retriever, item["question"])
        hit = any(kw in answer for kw in item["expected_keywords"])
        hits += int(hit)
        details.append(
            {
                "question": item["question"],
                "hit": hit,
                "answer": answer,
                "missing_keywords": [
                    kw for kw in item["expected_keywords"] if kw not in answer
                ],
            }
        )
    total = len(dataset)
    return {
        "total": total,
        "hits": hits,
        "rate": (hits / total) if total else 0.0,
        "details": details,
    }


def evaluate_with_ragas(llm, retriever, dataset) -> dict | None:
    """段 2：可选 RAGAS 评估（faithfulness / answer_relevancy）。

    未安装 ragas 时返回 None 并给出提示，不影响段 1。
    """
    try:
        from datasets import Dataset
        from ragas import evaluate
        from ragas.metrics import (  # type: ignore
            answer_relevancy,
            faithfulness,
        )
    except ImportError:
        print("⚠️ 未安装 ragas / datasets，跳过 RAGAS 评估（pip install ragas datasets）。")
        return None

    rows = {"question": [], "answer": [], "contexts": []}
    for item in dataset:
        answer = run_qa(llm, retriever, item["question"])
        docs = retriever.invoke(item["question"])
        rows["question"].append(item["question"])
        rows["answer"].append(answer)
        rows["contexts"].append([d.page_content for d in docs])

    dataset_obj = Dataset.from_dict(rows)
    return evaluate(
        dataset_obj,
        metrics=[faithfulness, answer_relevancy],
    ).to_dict()  # type: ignore


def main() -> None:
    check_api_key()

    mod04 = _load_04()
    try:
        vectorstore = mod04.build_or_load_vectorstore()
    except Exception as e:  # noqa: BLE001
        raise SystemExit(f"\n✗ 构建/加载向量库失败：{e}") from e

    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
    llm = get_llm()

    print("\n=== 段 1：自建上下文命中率 ===")
    result = evaluate_context_recall(llm, retriever, EVAL_DATASET)
    print(f"命中 {result['hits']}/{result['total']}（{result['rate']:.0%}）")
    for d in result["details"]:
        mark = "✓" if d["hit"] else "✗"
        print(f"  {mark} {d['question']}")
        if not d["hit"]:
            print(f"      期望关键词未出现：{d['missing_keywords']}")

    if result["hits"] < 4:
        print(
            "\n⚠️ 命中率偏低（< 4/5）。可尝试：增大 k、调整 chunk_size/overlap、"
            "或优化 prompt。注意：真实模型偶发失手也属正常。"
        )
    else:
        print("\n✓ 上下文命中率达标（≥ 4/5）。")

    print("\n=== 段 2：RAGAS 评估（可选）===")
    ragas_result = evaluate_with_ragas(llm, retriever, EVAL_DATASET)
    if ragas_result is not None:
        print("RAGAS 结果：", ragas_result)


if __name__ == "__main__":
    main()
