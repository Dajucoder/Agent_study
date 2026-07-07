"""02 · 链（Chains）与 LCEL

演示用 | 管道把 提示词→模型→解析 串成链，以及并行、透传、流式三种常见用法。
运行：python examples/02_chains.py
"""
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

from _common import check_api_key, get_llm


def main() -> None:
    check_api_key()
    llm = get_llm()
    parser = StrOutputParser()

    # ---- 1) 最基础的链：提示词 | 模型 | 解析 ----
    print("【1) 基础链】")
    prompt = ChatPromptTemplate.from_messages([
        ("system", "你是一个翻译助手，只输出翻译结果，不要解释。"),
        ("human", "把下面内容翻译成{target_language}：\n{text}"),
    ])
    translate_chain = prompt | llm | parser
    print(translate_chain.invoke({"target_language": "英语", "text": "你好，世界"}))

    # ---- 2) RunnableParallel：同一输入并行走多个分支 ----
    print("\n【2) 并行链】")
    summary_prompt = ChatPromptTemplate.from_template("用一句话总结：{text}")
    keywords_prompt = ChatPromptTemplate.from_template("提取3个关键词（逗号分隔）：{text}")
    parallel_chain = RunnableParallel({
        "summary": summary_prompt | llm | parser,
        "keywords": keywords_prompt | llm | parser,
    })
    result = parallel_chain.invoke({
        "text": "LangChain 是一个用于构建大语言模型应用的框架，它把模型、提示词、记忆、检索等能力组合成链。"
    })
    print(result)

    # ---- 3) RunnablePassthrough：保留原始输入 ----
    print("\n【3) 透传链】")
    echo_chain = {
        "answer": prompt | llm | parser,
        "original_text": RunnablePassthrough(),
    } | (lambda x: f"问题文本：{x['original_text']['text']}\n翻译结果：{x['answer']}")
    print(echo_chain.invoke({"target_language": "英语", "text": "今天天气真好"}))

    # ---- 4) 流式输出 ----
    print("\n【4) 流式输出】")
    for chunk in translate_chain.stream({"target_language": "日语", "text": "我爱学习编程"}):
        print(chunk, end="", flush=True)
    print()


if __name__ == "__main__":
    main()
