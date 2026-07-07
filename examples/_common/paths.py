"""_common.paths · 内部路径常量

把路径解析集中到一个子模块，避免 __init__.py 与 env.py 互相递归 import。
"""
from __future__ import annotations

import sys
from pathlib import Path

# 兜底：让 `python examples/0x_xxx.py` 这种调用也能 import 到 _common
_THIS_DIR = Path(__file__).resolve().parent
_EXAMPLES_DIR = _THIS_DIR.parent
PROJECT_ROOT: Path = _EXAMPLES_DIR.parent

# 确保 examples/ 与 项目根 在 sys.path
if str(_EXAMPLES_DIR) not in sys.path:
    sys.path.insert(0, str(_EXAMPLES_DIR))
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))
