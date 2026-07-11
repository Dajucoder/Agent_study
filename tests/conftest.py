"""tests/conftest.py

把 examples/ 加进 sys.path，使得 `from _common import ...` 之类的导入能工作。
不需要安装整个项目为包，对学习项目友好。
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXAMPLES = ROOT / "examples"
TESTS = ROOT / "tests"
for p in (ROOT, EXAMPLES, TESTS):
    sp = str(p)
    if sp not in sys.path:
        sys.path.insert(0, sp)
