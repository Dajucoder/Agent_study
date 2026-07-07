"""测试 ChatPromptTemplate 拼装：确保变量占位符能正确被填入。"""
from langchain_core.prompts import ChatPromptTemplate


def test_chat_prompt_renders_variables():
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个{role}。"),
        ("human", "请回答：{question}"),
    ])
    rendered = prompt.format_messages(role="翻译", question="你好")
    contents = [m.content for m in rendered]
    assert contents == ["你是一个翻译。", "请回答：你好"]


def test_chat_prompt_partial_keeps_remaining_variables():
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是{role}。\n{format_instructions}"),
        ("human", "{text}"),
    ]).partial(format_instructions="请输出 JSON。")
    rendered = prompt.format_messages(role="助手", text="hi")
    assert rendered[0].content == "你是助手。\n请输出 JSON。"
    assert rendered[1].content == "hi"
