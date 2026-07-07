"""05 · 代理（Agents）

定义工具，让 LLM 自主选择调用，完成多步任务。
计算器使用自实现的"四则运算 + 括号"解析器（见 _common._safe_eval），
避免 eval 的安全风险。

运行：python examples/05_agents.py
"""
from datetime import datetime

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool

# langchain 0.3+ 把 AgentExecutor / create_tool_calling_agent 迁移到 langchain-classic；
# 在 1.x 中只能从 langchain_classic 导入。
try:
    from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
except ImportError:  # 兼容老版本
    from langchain.agents import AgentExecutor, create_tool_calling_agent

from _common import _safe_eval, check_api_key, get_llm


@tool
def calculator(expression: str) -> str:
    """计算一个四则运算表达式（支持 + - * / 与括号），例如 '23 * 7 + 4'。"""
    try:
        return str(_safe_eval(expression))
    except Exception as e:  # noqa: BLE001
        return f"计算错误：{e}"


@tool
def get_current_time() -> str:
    """返回当前本地时间，当用户询问时间时调用。"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def main() -> None:
    check_api_key()
    llm = get_llm()
    tools = [calculator, get_current_time]

    # 2) 构造 Agent 提示词（必须包含 agent_scratchpad 占位符）
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个会使用工具的助手，必要时调用工具来回答。"),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, max_iterations=5)

    # 3) 运行：模型会自己决定调用哪个工具、以什么顺序
    answer = agent_executor.invoke(
        {"input": "现在是几点？另外帮我算一下 23 乘以 7 是多少。"}
    )["output"]
    print("\n最终回答：", answer)


if __name__ == "__main__":
    main()
