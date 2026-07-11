"""01 · 模型与提示词（Model I/O）

演示：基础对话、ChatPromptTemplate 动态构造、结构化输出（langchain 1.x 推荐 with_structured_output）。
运行：python examples/01_models_prompts.py
"""
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

from _common import check_api_key, get_llm


def main() -> None:
    check_api_key()
    llm = get_llm()

    # ---- 1) 最基础的对话调用 ----
    print("【1) 基础对话】")
    print(llm.invoke("你好，介绍一下你自己。").content)

    # ---- 2) 用 ChatPromptTemplate 动态构造多角色提示词 ----
    print("\n【2) 提示词模板】")
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个{role}，请用专业且简洁的语言回答。"),
        ("human", "{question}"),
    ])
    chain = prompt | llm | StrOutputParser()
    print(chain.invoke({"role": "Python 专家", "question": "什么是装饰器？"}))

    # ---- 3) 用 PromptTemplate 做单段文本模板（字符串变量） ----
    print("\n【3) 单段文本模板】")
    tpl = PromptTemplate.from_template("把下面句子翻译成英文：{sentence}")
    print((tpl | llm | StrOutputParser()).invoke({"sentence": "今天天气真好"}))

    # ---- 4) 结构化输出：langchain 1.x 推荐 with_structured_output ----
    print("\n【4) 结构化输出】")

    class Translation(BaseModel):
        language: str = Field(description="目标语言名称")
        text: str = Field(description="翻译后的文本")

    # 1.x 现代写法：一行让模型按 Pydantic schema 返回结构化对象（自动校验）
    structured_llm = llm.with_structured_output(Translation)
    result = structured_llm.invoke("把下面内容翻译成英语：\n你好，世界")
    print(f"language={result.language}, text={result.text}")

    # （对比）1.x 之前常用 PydanticOutputParser + get_format_instructions() + .partial(...)
    # 的写法，现已由 with_structured_output 一行取代；老写法仍可运行，但 1.x 不再推荐。


if __name__ == "__main__":
    main()
