"""P34 · 03_memory_runnable.py 自检逻辑离线测试（mock LLM）

用 MagicMock 替换 ChatOpenAI：第 2 轮返回含"小明"的回复，
验证模块内的「同会话记住 / 新会话不串号」断言通过。
"""
from _helpers import StubChatModel, load_example


def test_03_memory_runnable_selfcheck(monkeypatch):
    mod = load_example("03_memory_runnable.py")
    monkeypatch.setattr(mod, "check_api_key", lambda: None)

    # 第1轮：确认收到名字；第2轮：记得名字；新会话：不知道名字
    fake = StubChatModel(
        responses=[
            "好的，我记住了。",
            "你叫小明。",
            "我不知道你的名字。",
        ]
    )
    monkeypatch.setattr(mod, "get_llm", lambda: fake)

    # main() 内部含 assert，断言通过则无异常
    mod.main()
