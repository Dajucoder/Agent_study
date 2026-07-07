# ===== LangChain 学习项目镜像 =====
# 多阶段构建：第一阶段装依赖得到 wheels，第二阶段复制到运行时镜像（更小）

# ---- 阶段 1：builder ----
FROM python:3.11-slim AS builder

# 关键系统依赖：构建 chromadb 需要的 C++ 工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 用 venv 隔离系统 Python
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 先复制锁文件，最大化层缓存命中
COPY requirements.lock /tmp/requirements.lock
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r /tmp/requirements.lock


# ---- 阶段 2：runtime ----
FROM python:3.11-slim AS runtime

# 安全：以非 root 用户运行
RUN groupadd --system app && useradd --system --gid app --create-home --home-dir /home/app app

# 仅复制 venv（不复制 builder 整层，体积小）
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8 \
    PORT=8000

WORKDIR /app

# 复制源码（利用 .dockerignore 排除 venv、data、tests 等）
COPY --chown=app:app . /app

USER app

EXPOSE 8000

# 默认启动 LangServe；可通过环境变量切换
#   docker run -e CMD=jupyter -p 8888:8888 ...
ENV CMD=langserve
CMD ["sh", "-c", "\
    if [ \"$CMD\" = \"langserve\" ]; then \
        exec python examples/06_langserve.py; \
    elif [ \"$CMD\" = \"jupyter\" ]; then \
        exec jupyter notebook --ip=0.0.0.0 --port=${PORT:-8888} --no-browser --allow-root; \
    else \
        exec python \"$CMD\"; \
    fi"]
