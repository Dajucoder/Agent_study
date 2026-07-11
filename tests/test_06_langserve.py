"""P35 · 06_langserve.py 端点测试（FastAPI TestClient，离线）

用 FakeMessagesListChatModel 替换 ChatOpenAI，验证：
- GET /health → 200 {"status": "ok"}
- GET /       → 200（LangServe 根信息）
- GET /chain/input_schema → 200 + 合法 JSON
无需真实 API Key。
"""
from _helpers import StubChatModel, load_example


def test_06_langserve_endpoints(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "dummy")
    mod = load_example("06_langserve.py")

    fake = StubChatModel(responses=["ok"])
    monkeypatch.setattr(mod, "get_llm", lambda: fake)
    monkeypatch.setattr(mod, "check_api_key", lambda: None)

    # 重新构建一份使用假 LLM 的 app（模块顶层 app 用的是真实 llm）
    app = mod.create_app()
    from fastapi.testclient import TestClient

    client = TestClient(app)

    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}

    r2 = client.get("/openapi.json")
    assert r2.status_code == 200

    r3 = client.get("/chain/input_schema")
    assert r3.status_code == 200
    assert isinstance(r3.json(), dict)
