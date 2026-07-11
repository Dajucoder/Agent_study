"""examples/_common/

Shared utilities for the 0x_*.py scripts in this directory.

This package is split into submodules by responsibility:
- env: environment variable loading & project paths
- llm: LLM / Embeddings factory
- io:  document / RAG helpers
- calc: AST-whitelist safe calculator (used by 05_agents.py)

For backward compatibility, all public symbols are re-exported here,
so the existing `from _common import get_llm, format_docs, ...` keeps working.

Usage (any of these works):
    1) cd examples && python 00_check.py        # Python auto-adds examples/ to sys.path
    2) python examples/00_check.py              # This __init__.py will add it
"""
from __future__ import annotations

import sys
from pathlib import Path

# 兜底：让 `python examples/0x_xxx.py` 这种调用也能 import 到 _common
_THIS_DIR = Path(__file__).resolve().parent      # .../examples/_common
_EXAMPLES_DIR = _THIS_DIR.parent                  # .../examples
_PROJECT_ROOT = _EXAMPLES_DIR.parent              # repo root

if str(_EXAMPLES_DIR) not in sys.path:
    sys.path.insert(0, str(_EXAMPLES_DIR))
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

from dotenv import load_dotenv  # noqa: E402

# 默认 .env 在仓库根目录
load_dotenv(_PROJECT_ROOT / ".env")

# ---- Re-export public API for backward compatibility ----
from _common.env import (  # noqa: E402, F401
    check_api_key,
    data_path,
    get_env,
    get_settings,
    project_root,
    require_env,
)
from _common.io import format_docs  # noqa: E402, F401
from _common.llm import get_embeddings, get_llm  # noqa: E402, F401
from _common.calc import _safe_eval  # noqa: E402, F401
from _common.settings import settings  # noqa: E402, F401

__all__ = [
    # env
    "get_env",
    "require_env",
    "check_api_key",
    "get_settings",
    "project_root",
    "data_path",
    # llm
    "get_llm",
    "get_embeddings",
    # io
    "format_docs",
    # calc
    "_safe_eval",
    # settings
    "settings",
]
