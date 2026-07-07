"""_common.calc · AST 白名单安全计算器

仅支持：数字、`+ - * /`、括号、一元 `+ -`。
不支持：变量、函数、属性、索引、列表/字典字面量、字符串等。

工作原理：
- 用 `ast.parse(expr, mode="eval")` 把字符串解析为 AST
- 递归遍历 AST，仅当节点类型在白名单内才放行
- 任何非法节点立即抛 `ValueError`
"""
from __future__ import annotations

import ast
import operator

_BIN_OPS: dict[type, object] = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
}
_UNARY_OPS: dict[type, object] = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}


def _safe_eval(expr: str) -> float:
    """仅支持数字、四则运算、括号；不支持变量、函数、属性。"""
    tree = ast.parse(expr, mode="eval")

    def _eval(node):
        if isinstance(node, ast.Expression):
            return _eval(node.body)
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value
        if isinstance(node, ast.BinOp) and type(node.op) in _BIN_OPS:
            return _BIN_OPS[type(node.op)](_eval(node.left), _eval(node.right))
        if isinstance(node, ast.UnaryOp) and type(node.op) in _UNARY_OPS:
            return _UNARY_OPS[type(node.op)](_eval(node.operand))
        raise ValueError(f"不支持的语法节点：{type(node).__name__}")

    return _eval(tree)
