"""03b · 记忆（Memory）— LangGraph 风格（推荐）

用 LangGraph 的 StateGraph + MemorySaver 实现多轮对话记忆。
相较于已 deprecated 的 RunnableWithMessageHistory，这是 langchain 1.x 推荐的状态/记忆管理方案：

- 对话消息列表由 MessagesState 承载（自动追加 AI/Human 消息）；
- 用 thread_id（等价于老方案的 session_id）隔离不同会话；
- MemorySaver 是内存版 checkpointer，重启即丢失，适合练习。

运行：python examples/03_memory_graph.py
"""
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph

from _common import check_api_key, get_llm


def main() -> None:
    check_api_key()
    llm = get_llm()

    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个简洁的助手。"),
        MessagesPlaceholder("messages"),
    ])

    workflow = StateGraph(MessagesState)

    def call_model(state: MessagesState):
        # MessagesState 自带 "messages" 列表，自动累积历史
        chain = prompt | llm
        response = chain.invoke(state["messages"])
        return {"messages": [response]}

    workflow.add_node("model", call_model)
    workflow.add_edge(START, "model")

    # MemorySaver 按 thread_id 隔离不同会话（等价于 session_id）
    memory = MemorySaver()
    app = workflow.compile(checkpointer=memory)

    # 同一个 thread_id 的多轮对话会共享上下文
    cfg = {"configurable": {"thread_id": "user-1"}}
    r1 = app.invoke({"messages": [HumanMessage(content="我的名字叫小明。")]}, config=cfg)
    print("第1轮：", r1["messages"][-1].content)
    r2 = app.invoke({"messages": [HumanMessage(content="我叫什么名字？")]}, config=cfg)
    print("第2轮：", r2["messages"][-1].content)

    # 不同 thread_id 之间互不干扰
    cfg2 = {"configurable": {"thread_id": "user-2"}}
    new_session = app.invoke({"messages": [HumanMessage(content="我叫什么名字？")]}, config=cfg2)
    print("新会话：", new_session["messages"][-1].content)

    # 简单自检：第二个回答里应当提到"小明"；新会话里不应知道姓名
    assert "小明" in r2["messages"][-1].content, (
        f"期望回复中包含'小明'，实际：{r2['messages'][-1].content!r}"
    )
    assert "小明" not in new_session["messages"][-1].content, (
        f"新会话不应包含'小明'，实际：{new_session['messages'][-1].content!r}"
    )
    print("\n✓ 自检通过：第 2 轮能记住姓名，新会话不串号。")


if __name__ == "__main__":
    main()
