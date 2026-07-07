"""测试 _common._safe_eval：05_agents.py 中安全计算器的核心逻辑。"""
import pytest

from _common import _safe_eval


@pytest.mark.parametrize(
    "expr,expected",
    [
        ("1 + 1", 2),
        ("10 - 3", 7),
        ("4 * 5", 20),
        ("20 / 4", 5.0),
        ("23 * 7", 161),
        ("(1 + 2) * 3", 9),
        ("-(5 + 5)", -10),
        ("2 ** 3", 8),  # 不在白名单中，应当抛错
    ],
)
def test_safe_eval_supported(expr, expected):
    if expr == "2 ** 3":
        with pytest.raises(ValueError):
            _safe_eval(expr)
    else:
        assert _safe_eval(expr) == expected


@pytest.mark.parametrize(
    "expr",
    [
        "__import__('os').system('echo pwn')",
        "open('data/docs/sample.txt').read()",
        "lambda x: x",
        "[x for x in range(10)]",
    ],
)
def test_safe_eval_rejects_unsafe(expr):
    """任何非白名单 AST 节点都应被拒绝。"""
    with pytest.raises((ValueError, SyntaxError)):
        _safe_eval(expr)
