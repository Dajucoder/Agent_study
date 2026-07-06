"""04 · 检索与 RAG（Retrieval-Augmented Generation）

基于本地 data/docs/sample.txt 构建向量库并做检索增强问答。
首次运行会创建 data/chroma 向量库并持久化；之后可直接加载。
运行：python examples/04_rag.py
"""
import os
from dotenv import load_dotenv

load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit("✗ 请先配置 .env 中的 OPENAI_API_KEY")

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate

DOC_PATH = "data/docs/sample.txt"
PERSIST_DIR = "data/chroma"

# 1) 加载并切分文档
loader = TextLoader(DOC_PATH, encoding="utf-8")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=40)
splits = splitter.split_documents(docs)

# 2) 向量化并存入 Chroma（持久化到磁盘）
embeddings = OpenAIEmbeddings(model=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"))
vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings, persist_directory=PERSIST_DIR)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# 3) 构造 RAG 链：检索到的上下文 + 问题 -> 模型生成
llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"))
prompt = ChatPromptTemplate.from_template(
    "只根据下面的上下文回答，若上下文没有答案就说“我不知道”。\n\n"
    "上下文：\n{context}\n\n问题：{question}"
)

def format_docs(docs):
    return "\n\n".join(d.page_content for d in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

question = "LangChain 的核心抽象有哪些？"
print("问题：", question)
print("回答：", rag_chain.invoke(question))
