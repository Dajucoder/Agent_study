"""P32 · _common/env.py 单元测试（无需 LLM）

覆盖：get_env 默认值、require_env 缺失抛 SystemExit、check_api_key 行为。
"""
import os

import pytest

from _common.env import check_api_key, get_env, require_env


def test_get_env_default_when_unset(monkeypatch):
    monkeypatch.delenv("AGENT_STUDY_TEST_UNSET", raising=False)
    assert get_env("AGENT_STUDY_TEST_UNSET", "fallback") == "fallback"
    assert get_env("AGENT_STUDY_TEST_UNSET") is None


def test_get_env_reads_existing(monkeypatch):
    monkeypatch.setenv("AGENT_STUDY_TEST_VAL", "hello")
    assert get_env("AGENT_STUDY_TEST_VAL") == "hello"


def test_require_env_missing_exits(monkeypatch):
    monkeypatch.delenv("AGENT_STUDY_TEST_MISSING", raising=False)
    with pytest.raises(SystemExit):
        require_env("AGENT_STUDY_TEST_MISSING")


def test_require_env_present(monkeypatch):
    monkeypatch.setenv("AGENT_STUDY_TEST_PRESENT", "x")
    assert require_env("AGENT_STUDY_TEST_PRESENT") == "x"


def test_check_api_key_exits_when_unset(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with pytest.raises(SystemExit):
        check_api_key()


def test_check_api_key_ok_when_set(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test")
    # 不设真实值，仅验证不抛异常
    assert check_api_key() is None
    # 还原，避免影响后续测试
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    _ = os.getenv("OPENAI_API_KEY")
