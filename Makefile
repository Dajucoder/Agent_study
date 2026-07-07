.PHONY: help setup check run-00 run-01 run-02 run-03 run-04 run-05 run-06 test lint clean

# Python 解释器：可在命令行覆盖，如 `make PY=.venv/bin/python test`
PY ?= python

# 默认目标：列出所有可用命令
help:
	@echo "可用命令："
	@echo "  make setup     同步依赖（建议使用 requirements.lock）"
	@echo "  make check     跑 00_check.py 验证环境"
	@echo "  make run-NN    跑对应章节示例（NN = 00..06）"
	@echo "  make test      跑 pytest 单元测试"
	@echo "  make lint      跑 ruff 检查"
	@echo "  make clean     清理临时文件（__pycache__、.pytest_cache、data/chroma）"

# ---- 环境 ----
setup:
	pip install -r requirements.lock

check:
	$(PY) examples/00_check.py

# ---- 各章示例 ----
run-00: check
run-01:
	$(PY) examples/01_models_prompts.py
run-02:
	$(PY) examples/02_chains.py
run-03:
	$(PY) examples/03_memory.py
run-04:
	$(PY) examples/04_rag.py
run-05:
	$(PY) examples/05_agents.py
run-06:
	DEV=1 $(PY) examples/06_langserve.py

# ---- 质量门禁 ----
test:
	pytest tests/ -q

lint:
	ruff check examples/ tests/

clean:
	rm -rf examples/__pycache__ tests/__pycache__ .pytest_cache .ruff_cache
	rm -rf data/chroma
