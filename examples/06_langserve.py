"""06 · 服务化（LangServe）

把一条链发布为 HTTP API。需先取消 requirements.txt 中 langserve/fastapi/uvicorn 的注释并安装。
运行：python examples/06_langserve.py
然后访问 http://localhost:8000/chain/playground 调试，或用 /chain/invoke 调用。
"""
import os
from dotenv import load_dotenv

load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit("✗ 请先配置 .env 中的 OPENAI_API_KEY")

from fastapi import FastAPI
from langserve import add_routes
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"))

# 要发布的链
chain = (
    ChatPromptTemplate.from_template("用一句话回答：{question}")
    | llm
    | StrOutputParser()
)

app = FastAPI(title="LangChain 学习 API", version="0.1.0")
add_routes(app, chain, path="/chain")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
