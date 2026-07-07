"""examples/_common.py

公共工具：环境变量加载、LLM/Embeddings 工厂、向量库路径解析等。
本目录下的 0x_*.py 脚本统一从这里导入，避免样板代码重复。

使用方式（任一即可）：
    1) cd examples && python 00_check.py        # Python 会自动把 examples 加进 sys.path
    2) python examples/00_check.py              # _common.py 内部会兜底把目录加入 sys.path
"""
from __future__ import annotations

import ast
import operator
import os
import sys
from pathlib import Path

# 兜底：让 `python examples/0x_xxx.py` 这种调用也能 import 到 _common
_THIS_DIR = Path(__file__).resolve().parent
if str(_THIS_DIR) not in sys.path:
    sys.path.insert(0, str(_THIS_DIR))

# 把项目根目录加进 sys.path，使 `from data.xxx` 或相对路径 `data/docs/sample.txt` 始终从仓库根解析
_PROJECT_ROOT = _THIS_DIR.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from dotenv import load_dotenv  # noqa: E402

# 默认 .env 在仓库根目录
load_dotenv(_PROJECT_ROOT / ".env")


# ---------- 环境变量 ----------
def get_env(name: str, default: str | None = None) -> str | None:
    """读取 .env 中的变量，未设置时返回 default。"""
    return os.getenv(name, default)


def require_env(name: str) -> str:
    """读取必填环境变量，缺失时给出友好错误并退出。"""
    value = os.getenv(name)
    if not value:
        raise SystemExit(
            f"✗ 未找到 {name}，请复制 .env.example 为 .env 并填写后重试。"
        )
    return value


# ---------- 模型工厂 ----------
def get_llm(model: str | None = None, **kwargs):
    """构造 ChatOpenAI 实例。

    - 默认模型来自 .env 的 OPENAI_MODEL（缺省 gpt-4o-mini）。
    - OPENAI_API_BASE 已自动读取（兼容第三方 OpenAI 风格服务）。
    """
    # 延迟导入：让 _common 在没装 langchain 时也能被部分静态工具加载
    from langchain_openai import ChatOpenAI

    model_name = model or get_env("OPENAI_MODEL", "gpt-4o-mini")
    return ChatOpenAI(model=model_name, **kwargs)


def get_embeddings(model: str | None = None, **kwargs):
    """构造 OpenAIEmbeddings 实例。"""
    from langchain_openai import OpenAIEmbeddings

    model_name = model or get_env("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    return OpenAIEmbeddings(model=model_name, **kwargs)


# ---------- 路径 ----------
def project_root() -> Path:
    """仓库根目录绝对路径。"""
    return _PROJECT_ROOT


def data_path(*parts: str) -> Path:
    """拼接仓库 data/ 下的路径，例如 data_path('docs', 'sample.txt')。"""
    return _PROJECT_ROOT.joinpath("data", *parts)


# ---------- 校验 ----------
def check_api_key() -> None:
    """脚本入口处调用一次，确保 OPENAI_API_KEY 已配置。"""
    require_env("OPENAI_API_KEY")


# ---------- RAG 工具 ----------
def format_docs(docs) -> str:
    """把若干 Document 拼接为单段上下文，用 \\n\\n 分隔。供 RAG 链与测试共用。"""
    return "\n\n".join(d.page_content for d in docs)


# ---------- 安全计算器（基于 AST 白名单，05_agents.py 复用） ----------
_BIN_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
}
_UNARY_OPS = {
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
