"""01 · 模型与提示词（Model I/O）

演示：基础对话、ChatPromptTemplate 动态构造、PydanticOutputParser 结构化解析。
运行：python examples/01_models_prompts.py
"""
import os
from dotenv import load_dotenv

load_dotenv()
if not os.getenv("OPENAI_API_KEY"):
    raise SystemExit("✗ 请先配置 .env 中的 OPENAI_API_KEY")

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from pydantic import BaseModel, Field

llm = ChatOpenAI(model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"))

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

# ---- 4) PydanticOutputParser：让模型返回结构化对象 ----
print("\n【4) 结构化输出】")

class Translation(BaseModel):
    language: str = Field(description="目标语言名称")
    text: str = Field(description="翻译后的文本")

parser = PydanticOutputParser(pydantic_object=Translation)
struct_prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个翻译器。\n{format_instructions}"),
    ("human", "把下面内容翻译成{target_language}：\n{text}"),
]).partial(format_instructions=parser.get_format_instructions())

struct_chain = struct_prompt | llm | parser
result = struct_chain.invoke({"target_language": "英语", "text": "你好，世界"})
print(f"language={result.language}, text={result.text}")
