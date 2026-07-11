"""09 · 缓存（Caching）

演示 LangChain 的 LLM 缓存层：同一提问命中缓存后不再调用模型，省 token、降延迟。
配合 docs/COST_AND_LIMITS.md 的「2.4 缓存」一节阅读。

段 1：InMemoryCache —— 进程内缓存，第二次同一提问秒回。
段 2：SQLiteCache —— 落盘到 .cache/langchain.db，跨进程复用。
段 3：用 get_llm_cache 检查当前缓存类型。

运行：python examples/09_caching.py   （需要可用的 OPENAI_API_KEY）
"""
import os

from langchain_community.cache import InMemoryCache, SQLiteCache
from langchain_core.globals import get_llm_cache, set_llm_cache

from _common import check_api_key, get_llm


def main() -> None:
    check_api_key()
    llm = get_llm()

    q = "用一句话解释什么是 LLM 缓存。"

    # ---- 1) 内存缓存：第二次命中秒回 ----
    print("【1) InMemoryCache】")
    set_llm_cache(InMemoryCache())
    r1 = llm.invoke(q)
    r2 = llm.invoke(q)  # 与 r1 完全相同输入 → 命中缓存
    print("第一次：", r1.content[:40], "...")
    print("第二次（命中缓存，不再调用模型）：", r2.content[:40], "...")
    print("当前缓存类型：", type(get_llm_cache()).__name__)

    # ---- 2) SQLite 缓存：落盘，跨进程复用 ----
    print("\n【2) SQLiteCache】")
    os.makedirs(".cache", exist_ok=True)
    set_llm_cache(SQLiteCache(database_path=".cache/langchain.db"))
    r3 = llm.invoke(q)
    print("跨进程首次写入：", r3.content[:40], "...")
    r4 = llm.invoke(q)  # 同一进程内再次命中
    print("再次命中：", r4.content[:40], "...")
    print("当前缓存类型：", type(get_llm_cache()).__name__)

    # ---- 3) 检查当前缓存 ----
    print("\n【3) 当前缓存探测】")
    cache = get_llm_cache()
    if cache is None:
        print("未设置任何缓存。")
    else:
        print(f"已启用缓存：{type(cache).__name__}")

    print("\n✓ 缓存演示结束。")


if __name__ == "__main__":
    main()
