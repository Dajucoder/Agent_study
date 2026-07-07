"""_common.env · 环境变量 / 路径解析

只依赖标准库与项目根 `.env`（由 `__init__.py` 提前加载）。
"""
from __future__ import annotations

import os
from pathlib import Path

from _common.paths import PROJECT_ROOT  # noqa: F401  re-export for back-compat

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


def check_api_key() -> None:
    """脚本入口处调用一次，确保 OPENAI_API_KEY 已配置。"""
    require_env("OPENAI_API_KEY")


# ---------- 路径 ----------
def project_root() -> Path:
    """仓库根目录绝对路径。"""
    return PROJECT_ROOT


def data_path(*parts: str) -> Path:
    """拼接仓库 data/ 下的路径，例如 data_path('docs', 'sample.txt')。"""
    return PROJECT_ROOT.joinpath("data", *parts)
