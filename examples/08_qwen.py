"""08 · 通义千问（DashScope 兼容模式）

本示例展示用 LangChain + DashScope 的 OpenAI 兼容端点接入通义千问：
- 无需 dashscope SDK 也能用；只依赖 langchain-openai
- 支持 qwen-turbo、qwen-plus、qwen-max、qwen-long 等
- 也可以用官方 dashscope SDK：`from langchain_community.chat_models.tongyi import ChatTongyi`

== 0. 准备 ==
1) 注册并开通 DashScope：<https://dashscope.aliyun.com/>
2) 创建 API Key
3) 加入环境变量（.env）：
       DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
       DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
       DASHSCOPE_MODEL=qwen-plus
4) 启用 function calling / agent 需用支持工具调用的模型：
   qwen-turbo / qwen-plus / qwen-max 均可；qwen-long 文档型不推荐

== 1. 运行 ==
    pip install langchain-openai
    python examples/08_qwen.py
"""
import os

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from _common import get_env


def build_llm() -> ChatOpenAI:
    """构造连到 DashScope 兼容端点的 ChatOpenAI。"""
    api_key = get_env("DASHSCOPE_API_KEY")
    if not api_key:
        raise SystemExit(
            "✗ 未找到 DASHSCOPE_API_KEY。\n"
            "  请在 .env 中设置：\n"
            "    DASHSCOPE_API_KEY=sk-xxxxxxxxxx\n"
            "    DASHSCOPE_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1\n"
            "  注册地址：https://dashscope.aliyun.com/"
        )
    return ChatOpenAI(
        model=get_env("DASHSCOPE_MODEL", "qwen-plus"),
        api_key=api_key,
        base_url=get_env(
            "DASHSCOPE_BASE_URL",
            "https://dashscope.aliyuncs.com/compatible-mode/v1",
        ),
    )


def main() -> None:
    llm = build_llm()

    # ---- 1) 最基础的对话 ----
    print("【1) 基础对话】")
    print(llm.invoke([
        SystemMessage(content="你是一个简洁的中文助手。"),
        HumanMessage(content="你好，介绍一下你自己。"),
    ]).content)

    # ---- 2) LCEL 链：摘要 + 关键词（演示双分支并行）----
    print("\n【2) 并行 LCEL 链】")
    summary_prompt = ChatPromptTemplate.from_template("用一句话总结：{text}")
    keywords_prompt = ChatPromptTemplate.from_template(
        "提取 3 个中文关键词（顿号分隔）：{text}"
    )
    from langchain_core.runnables import RunnableParallel

    parallel = RunnableParallel(
        summary=summary_prompt | llm | StrOutputParser(),
        keywords=keywords_prompt | llm | StrOutputParser(),
    )
    print(parallel.invoke({
        "text": "LangChain 是一个用于构建大语言模型应用的框架，"
                "提供模型、提示词、记忆、检索、代理等组件。"
    }))

    # ---- 3) 与 OpenAI 兼容端点一样可走 function calling ----
    print("\n【3) 工具调用（如果模型支持）】")
    try:
        from langchain_community.tools import tool

        @tool
        def get_weather(city: str) -> str:
            """查询某城市天气（演示用，永远返回晴天）。"""
            return f"{city}：晴，25°C"

        bound = llm.bind_tools([get_weather])
        resp = bound.invoke("北京今天天气怎么样？")
        if resp.tool_calls:
            print("✓ 模型发起工具调用：", resp.tool_calls)
        else:
            print("（模型未触发工具调用。DashScope 部分模型需在 prompt 显式引导。）")
            print("回复：", resp.content)
    except Exception as e:  # noqa: BLE001
        print(f"（跳过工具调用演示：{e}）")

    # ---- 4) 提示：省钱技巧 ----
    print(
        "\n💡 DashScope 调价策略：\n"
        "  - qwen-turbo：极快、便宜，适合日常对话\n"
        "  - qwen-plus： 性价比高，推荐默认\n"
        "  - qwen-max：  复杂推理任务\n"
        f"  - 当前模型：{os.getenv('DASHSCOPE_MODEL', 'qwen-plus')}"
    )


if __name__ == "__main__":
    main()
