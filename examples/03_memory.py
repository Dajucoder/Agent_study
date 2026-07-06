"""03 · 记忆（Memory）

用 RunnableWithMessageHistory 给链挂载多轮对话记忆，按 session_id 隔离不同会话。
运行：python examples/03_memory.py
"""
import os
from dotenv import load_dotenv

load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit("✗ 请先配置 .env 中的 OPENAI_API_KEY")

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"))

# 历史消息会被插入到 MessagesPlaceholder("history") 所在位置
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个简洁的助手。"),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])
chain = prompt | llm | StrOutputParser()

# 用字典按 session_id 保存不同会话的历史
store: dict = {}

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

# 同一个 session_id 的多轮对话会共享上下文
cfg = {"configurable": {"session_id": "user-1"}}
print("第1轮：", chain_with_history.invoke({"input": "我的名字叫小明。"}, config=cfg))
print("第2轮：", chain_with_history.invoke({"input": "我叫什么名字？"}, config=cfg))  # 应能回答“小明”

# 不同 session_id 之间互不干扰
cfg2 = {"configurable": {"session_id": "user-2"}}
print("新会话：", chain_with_history.invoke({"input": "我叫什么名字？"}, config=cfg2))  # 应说不知道
