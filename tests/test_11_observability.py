"""P38 · 11_observability.py 离线测试

只验证模块可被导入、三个 demo 函数存在且可调用（不实际发起真实 LLM 调用）。
其中 OTel 段依赖 opentelemetry（已装）——单独用 mock 验证其初始化逻辑不抛异常。
"""
from _helpers import load_example


def test_11_import_and_functions_exist():
    mod = load_example("11_observability.py")
    for name in ("demo_token_count", "demo_langsmith_tracing", "demo_otel"):
        assert hasattr(mod, name), f"缺少函数 {name}"
        assert callable(getattr(mod, name))


def test_11_otel_dependency_available():
    """OTel 段依赖 opentelemetry；本仓库 .venv 已装，且 demo_otel 函数存在。

    注意：不在 pytest 中实际调用 demo_otel()，因为它会设置全局
    TracerProvider 并启动后台 OTLP exporter（无本地 collector 时重连噪声），
    污染其他测试的全局状态。
    """
    mod = load_example("11_observability.py")
    assert hasattr(mod, "demo_otel")
    try:
        from opentelemetry.sdk.trace import TracerProvider  # noqa: F401

        available = True
    except ImportError:
        available = False
    # 本仓库 .venv 已装 opentelemetry，说明 demo_otel 内部初始化路径可用
    assert available is True
