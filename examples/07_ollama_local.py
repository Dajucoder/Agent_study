"""07 · 本地模型（Ollama）零成本上手

本示例展示如何在不依赖任何外部 API 的情况下使用 LangChain：
- 通过 Ollama 跑本地开源模型（qwen2、llama3、mistral…）
- 配套使用本地 embedding 做 RAG
- 默认无需任何 API Key

== 0. 准备 ==
1) 安装 Ollama：<https://ollama.com/download>
2) 拉取模型（在终端执行）：
       ollama pull qwen2:7b
       ollama pull nomic-embed-text         # 本地 embedding
3) Ollama 默认监听 http://localhost:11434；如改了端口，设：
       OLLAMA_BASE_URL=http://localhost:11434

== 1. 运行 ==
    pip install langchain-ollama langchain-community
    python examples/07_ollama_local.py

== 2. 关键差异 vs OpenAI ==
- 无 network egress：完全离线，零 token 费用
- 速度受本机 GPU/CPU 限制（CPU 上 7B 模型约 5-15 token/s）
- 模型上下文窗口与 OpenAI 相当（qwen2 32K），但需自己控制显存
"""
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

from _common import data_path, format_docs

# ---- 0. 模型配置（全部可由环境变量覆盖）----
LLM_MODEL = "qwen2:7b"               # 或 llama3.1:8b / mistral:7b
EMBED_MODEL = "nomic-embed-text"     # 配套的本地 embedding
BASE_URL = "http://localhost:11434"  # Ollama 默认地址
DOC_PATH = data_path("docs", "sample.txt")
PERSIST_DIR = data_path("chroma_ollama")  # 单独的向量库目录，避免与 OpenAI 混
COLLECTION_NAME = "agent_study_ollama"


def main() -> None:
    # ---- 1) 加载并切分文档（与 04_rag.py 相同）----
    print(f"… 加载 {DOC_PATH}")
    docs = TextLoader(str(DOC_PATH), encoding="utf-8").load()
    splits = RecursiveCharacterTextSplitter(
        chunk_size=200, chunk_overlap=40
    ).split_documents(docs)

    # ---- 2) 本地 embedding 写 Chroma（已存在则加载）----
    embeddings = OllamaEmbeddings(model=EMBED_MODEL, base_url=BASE_URL)
    if PERSIST_DIR.exists() and any(PERSIST_DIR.iterdir()):
        print(f"✓ 加载已存在的向量库：{PERSIST_DIR}")
        vectorstore = Chroma(
            persist_directory=str(PERSIST_DIR),
            embedding_function=embeddings,
            collection_name=COLLECTION_NAME,
        )
    else:
        print(f"… 构建向量库：{PERSIST_DIR}")
        vectorstore = Chroma.from_documents(
            documents=splits,
            embedding=embeddings,
            persist_directory=str(PERSIST_DIR),
            collection_name=COLLECTION_NAME,
        )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

    # ---- 3) 本地 ChatOllama + RAG 链 ----
    llm = ChatOllama(model=LLM_MODEL, base_url=BASE_URL, temperature=0)
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
    print("回答：", rag_chain.invoke(question))


if __name__ == "__main__":
    main()
