"""03 · 记忆（Memory）— 入口导航

本文件是「记忆」章节的入口，默认演示 langchain 1.x 推荐写法：

- 推荐示例：03_memory_graph.py   （LangGraph 风格：StateGraph + MemorySaver）
- 历史对照：03_memory_runnable.py（RunnableWithMessageHistory，1.x 已 deprecated）

运行：python examples/03_memory.py   （与 `make run-03` 等价，默认跑 LangGraph 版）
"""
import importlib.util
from pathlib import Path

from _common import check_api_key

# 文件名以数字开头，无法用普通 import，用 importlib 按路径加载
_graph_path = Path(__file__).with_name("03_memory_graph.py")
_spec = importlib.util.spec_from_file_location("_mem_graph", _graph_path)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)


if __name__ == "__main__":
    check_api_key()
    _mod.main()
