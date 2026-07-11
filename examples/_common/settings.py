"""_common.settings · 用 pydantic-settings 集中管理 .env

- 所有可配置项在此声明为**类型化字段**，避免散落在各模块里的 `os.getenv("OPENAI_API_KEY")`。
- `env.py` / `llm.py` 的 helper 改为读取本模块的单例 `settings`。
- 老的 `get_env(...)` / `require_env(...)` 仍保留（直接读 `os.getenv`），以便脚本逐步迁移、不破坏既有调用。

用法：
    from _common.settings import settings
    settings.openai_api_key          # str（缺省 ""）
    settings.openai_model           # str（缺省 "gpt-4o-mini"）
    settings.langchain_tracing_v2   # bool（缺省 False）
"""
from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

from _common.paths import PROJECT_ROOT


class Settings(BaseSettings):
    """从仓库根目录 `.env` 加载的全局配置（单例）。

    字段名即环境变量名（不区分大小写）。
    未设置的字段回退到下方默认值，因此不配置 `.env` 也能导入成功。
    """

    # 注意：故意**不**设 env_file —— 这样 Settings 只从 os.environ 读取。
    # .env 文件由 `_common/__init__.py` 的 load_dotenv() 注入 os.environ，
    # 因此用户配置依然生效；同时 monkeypatch.setenv/delenv（测试用）
    # 也能正常影响 Settings，行为与老 os.getenv 一致。
    model_config = SettingsConfigDict(
        extra="ignore",
        case_sensitive=False,
    )

    # ---- OpenAI ----
    openai_api_key: str = ""
    openai_api_base: str | None = None
    openai_model: str = "gpt-4o-mini"
    openai_embedding_model: str = "text-embedding-3-small"
    openai_temperature: float = 0.7
    openai_timeout: int = 30
    openai_max_retries: int = 2
    openai_embedding_timeout: int = 30

    # ---- LangSmith 可观测性 ----
    langchain_tracing_v2: bool = False
    langchain_api_key: str = ""
    langchain_project: str = "langchain-study"


# 单例：全局共享，避免重复解析 .env
settings = Settings()
