"""03a · 记忆（Memory）— RunnableWithMessageHistory 版本（历史对照）

用 RunnableWithMessageHistory 给链挂载多轮对话记忆，按 session_id 隔离不同会话。
⚠️ 该 API 在 langchain 1.x 已被标记为 deprecated（仍可用、会告警）。
推荐新写法见 03_memory_graph.py（LangGraph 风格）。本文件仅作「老 API 对照」保留。

运行：python examples/03_memory_runnable.py
"""
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory

from _common import check_api_key, get_llm


def main() -> None:
    check_api_key()
    llm = get_llm()

    # 历史消息会被插入到 MessagesPlaceholder("history") 所在位置
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个简洁的助手。"),
        MessagesPlaceholder("history"),
        ("human", "{input}"),
    ])

    # 底层链保留 AIMessage（不接 StrOutputParser），确保历史以正确类型写回。
    base_chain = prompt | llm

    # 用字典按 session_id 保存不同会话的历史
    store: dict = {}

    def get_session_history(session_id: str):
        if session_id not in store:
            store[session_id] = InMemoryChatMessageHistory()
        return store[session_id]

    chain_with_history = RunnableWithMessageHistory(
        base_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="history",
    )

    # 同一个 session_id 的多轮对话会共享上下文
    cfg = {"configurable": {"session_id": "user-1"}}
    reply_1 = chain_with_history.invoke({"input": "我的名字叫小明。"}, config=cfg)
    print("第1轮：", reply_1.content)
    reply_2 = chain_with_history.invoke({"input": "我叫什么名字？"}, config=cfg)
    print("第2轮：", reply_2.content)

    # 不同 session_id 之间互不干扰
    cfg2 = {"configurable": {"session_id": "user-2"}}
    new_session_reply = chain_with_history.invoke({"input": "我叫什么名字？"}, config=cfg2)
    print("新会话：", new_session_reply.content)

    # 简单自检：第二个回答里应当提到"小明"；新会话里不应知道姓名
    assert "小明" in reply_2.content, f"期望回复中包含'小明'，实际：{reply_2.content!r}"
    assert "小明" not in new_session_reply.content, (
        f"新会话不应包含'小明'，实际：{new_session_reply.content!r}"
    )
    print("\n✓ 自检通过：第 2 轮能记住姓名，新会话不串号。")


if __name__ == "__main__":
    main()
