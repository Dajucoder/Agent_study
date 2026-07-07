"""06 · 服务化（LangServe）

把一条链发布为 HTTP API。需先安装 requirements.txt 中已启用的 langserve/fastapi/uvicorn 依赖。
运行：python examples/06_langserve.py
然后访问：
  - http://localhost:8000/             （根信息）
  - http://localhost:8000/health       （健康检查）
  - http://localhost:8000/chain/playground  （可视化调试）

环境变量：
  DEV=1   开启 uvicorn reload（开发模式）
"""
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langserve import add_routes

from _common import check_api_key, get_llm


def create_app() -> FastAPI:
    """工厂函数，便于测试中复用。"""
    check_api_key()
    llm = get_llm()

    # 要发布的链
    chain = (
        ChatPromptTemplate.from_template("用一句话回答：{question}")
        | llm
        | StrOutputParser()
    )

    app = FastAPI(title="LangChain 学习 API", version="0.2.0")

    # CORS：开发期放行所有来源；生产请收紧 allow_origins。
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    add_routes(app, chain, path="/chain")
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "examples.06_langserve:app" if __package__ else app,
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEV") == "1",
    )
