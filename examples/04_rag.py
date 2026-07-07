"""04 · 检索与 RAG（Retrieval-Augmented Generation）

基于本地 data/docs/sample.txt 构建向量库并做检索增强问答。

- 首次运行：自动加载、切分、向量化、写入 data/chroma 持久化。
- 再次运行：检测到 data/chroma 已有索引则直接加载，避免重复计费。

运行：python examples/04_rag.py
"""
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_text_splitters import RecursiveCharacterTextSplitter

from _common import check_api_key, data_path, format_docs, get_embeddings, get_llm

DOC_PATH = data_path("docs", "sample.txt")
PERSIST_DIR = data_path("chroma")
COLLECTION_NAME = "langchain_study"


def build_or_load_vectorstore():
    """已存在则加载；不存在则构建并持久化。"""
    embeddings = get_embeddings()
    if PERSIST_DIR.exists() and any(PERSIST_DIR.iterdir()):
        print(f"✓ 检测到已存在的向量库：{PERSIST_DIR}，直接加载。")
        return Chroma(
            persist_directory=str(PERSIST_DIR),
            embedding_function=embeddings,
            collection_name=COLLECTION_NAME,
        )

    print(f"… 首次运行：从 {DOC_PATH} 构建向量库。")
    loader = TextLoader(str(DOC_PATH), encoding="utf-8")
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=40)
    splits = splitter.split_documents(docs)
    return Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=str(PERSIST_DIR),
        collection_name=COLLECTION_NAME,
    )


def main() -> None:
    check_api_key()

    # 1) 加载/构建向量库
    try:
        vectorstore = build_or_load_vectorstore()
    except Exception as e:  # noqa: BLE001
        raise SystemExit(
            f"\n✗ 构建/加载向量库失败：{e}\n"
            "  常见原因：\n"
            "    - .env 中 OPENAI_EMBEDDING_MODEL 与 OPENAI_API_BASE 不兼容\n"
            "      （例如：用了第三方兼容端点，但 embedding 模型仍是 OpenAI 专有）\n"
            "    - data/chroma 目录已损坏，可手动删除后重试\n"
        ) from e
    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

    # 2) 构造 RAG 链：检索到的上下文 + 问题 -> 模型生成
    llm = get_llm()
    prompt = ChatPromptTemplate.from_template(
        "只根据下面的上下文回答，若上下文没有答案就说“我不知道”。\n\n"
        "上下文：\n{context}\n\n问题：{question}"
    )

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    question = "LangChain 的核心抽象有哪些？"
    print("\n问题：", question)
    try:
        print("回答：", rag_chain.invoke(question))
    except Exception as e:  # noqa: BLE001
        raise SystemExit(
            f"\n✗ RAG 调用失败：{e}\n"
            "  常见原因：embedding 模型 / API 端点不匹配。\n"
            "  若使用第三方 OpenAI 兼容服务，请确保 OPENAI_EMBEDDING_MODEL 是该服务提供的。\n"
        ) from e


if __name__ == "__main__":
    main()
