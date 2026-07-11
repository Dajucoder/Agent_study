"""P32 · _common/paths.py 与 env.data_path 单元测试（无需 LLM）"""
from _common.env import data_path, project_root


def test_project_root_is_repo_root():
    # examples/_common/env.py -> repo root 应指向仓库根（含 README.md）
    assert (project_root() / "README.md").exists()


def test_data_path_joins_under_data():
    p = data_path("chroma")
    assert p.name == "chroma"
    # data_path 始终拼在仓库根的 data/ 之下
    assert str(p).replace("\\", "/").endswith("data/chroma")


def test_data_path_nested():
    p = data_path("docs", "sample.txt")
    assert p.name == "sample.txt"
    assert p.parent.name == "docs"
