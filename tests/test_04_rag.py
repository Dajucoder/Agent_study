"""P33 · 04_rag.py 离线测试（FakeEmbeddings 替代真实 embedding）

不连真实 LLM / OpenAI Embedding：用 FakeEmbeddings 构建 Chroma，
用 FakeMessagesListChatModel 替代 ChatOpenAI，验证 RAG 链能正常拼装并产出非空 str。
"""
from langchain_core.embeddings import FakeEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough

from _common import format_docs
from _helpers import StubChatModel, load_example


def test_04_rag_offline_chain(tmp_path, monkeypatch):
    mod = load_example("04_rag.py")
    # 假 embedding 避免联网；持久化目录指向临时路径，不污染 data/chroma
    monkeypatch.setattr(mod, "get_embeddings", lambda: FakeEmbeddings(size=128))
    monkeypatch.setattr(mod, "PERSIST_DIR", tmp_path)

    vectorstore = mod.build_or_load_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

    fake_llm = StubChatModel(
        responses=["LangChain 的核心抽象包括 Model I/O、Chain、Memory、Retrieval、Agent。"]
    )
    prompt = ChatPromptTemplate.from_template(
        "只根据上下文回答：\n{context}\n问题：{question}"
    )
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | fake_llm
        | StrOutputParser()
    )

    out = rag_chain.invoke("LangChain 的核心抽象有哪些？")
    assert isinstance(out, str)
    assert out.strip() != ""
