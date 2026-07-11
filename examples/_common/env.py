"""_common.env · 环境变量 / 路径解析

只依赖标准库与项目根 `.env`（由 `__init__.py` 提前加载）。
"""
from __future__ import annotations

import os
from pathlib import Path

from _common.paths import PROJECT_ROOT  # noqa: F401  re-export for back-compat
from _common.settings import Settings, settings  # noqa: F401  类型化配置单例

# ---------- 环境变量 ----------
def get_env(name: str, default: str | None = None) -> str | None:
    """读取 .env 中的变量，未设置时返回 default。

    说明：新代码推荐直接用 `from _common.settings import settings` 读取
    类型化字段；本函数保留用于读取未在 Settings 中声明的临时变量。
    """
    return os.getenv(name, default)


def require_env(name: str) -> str:
    """读取必填环境变量，缺失时给出友好错误并退出。"""
    value = os.getenv(name)
    if not value:
        raise SystemExit(
            f"✗ 未找到 {name}，请复制 .env.example 为 .env 并填写后重试。"
        )
    return value


def get_settings():
    """返回 pydantic-settings 单例（类型化配置入口）。"""
    return settings


def check_api_key() -> None:
    """脚本入口处调用一次，确保 OPENAI_API_KEY 已配置。

    每次重新读取 Settings（只从 os.environ 取，.env 由 load_dotenv 注入），
    因此 monkeypatch.setenv/delenv 能正常影响本函数，行为等同老 os.getenv。
    """
    if not Settings().openai_api_key:
        raise SystemExit(
            "✗ 未找到 OPENAI_API_KEY，请复制 .env.example 为 .env 并填写后重试。"
        )


# ---------- 路径 ----------
def project_root() -> Path:
    """仓库根目录绝对路径。"""
    return PROJECT_ROOT


def data_path(*parts: str) -> Path:
    """拼接仓库 data/ 下的路径，例如 data_path('docs', 'sample.txt')。"""
    return PROJECT_ROOT.joinpath("data", *parts)
