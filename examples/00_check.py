"""00 · 环境验证

确认 .env 已配置且能成功调用一次大模型。
运行：python examples/00_check.py
"""
from _common import check_api_key, get_llm


def main() -> None:
    check_api_key()
    llm = get_llm()
    response = llm.invoke("用一句话介绍 LangChain 是什么。")
    print("✓ 模型调用成功，返回内容：\n")
    print(response.content)


if __name__ == "__main__":
    main()
