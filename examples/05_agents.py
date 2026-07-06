"""05 · 代理（Agents）

定义工具，让 LLM 自主选择调用，完成多步任务。
运行：python examples/05_agents.py
"""
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit("✗ 请先配置 .env 中的 OPENAI_API_KEY")

from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"))

# 1) 定义工具：@tool 的 docstring 会被模型用来决定何时调用
@tool
def calculator(expression: str) -> str:
    """计算一个四则运算表达式，例如 '23 * 7 + 4'。"""
    try:
        # 限制命名空间，避免执行任意代码
        return str(eval(expression, {"__builtins__": {}}, {}))
    except Exception as e:
        return f"计算错误：{e}"

@tool
def get_current_time() -> str:
    """返回当前本地时间，当用户询问时间时调用。"""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

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
