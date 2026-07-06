"""00 · 环境验证

确认 .env 已配置且能成功调用一次大模型。
运行：python examples/00_check.py
"""
import os
from dotenv import load_dotenv

load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit("✗ 未找到 OPENAI_API_KEY，请复制 .env.example 为 .env 并填写。")

from langchain_openai import ChatOpenAI

# model 可在 .env 中用 OPENAI_MODEL 覆盖，默认 gpt-4o-mini
llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"))

response = llm.invoke("用一句话介绍 LangChain 是什么。")
print("✓ 模型调用成功，返回内容：\n")
print(response.content)
