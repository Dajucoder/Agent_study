# 06 · 服务化与部署（LangServe）

> 🌐 **English version**: [06-langserve-and-deployment.en.md](/en/06-langserve-and-deployment/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [📚 学习路线](LEARNING_GUIDE.md) · 上一章：[05 代理](05-agents.md) · 下一章：[ARCHITECTURE 架构总览](ARCHITECTURE.md) · 相关：[OBSERVABILITY 可观测性](OBSERVABILITY.md) · [PROJECT_STRUCTURE 目录结构](PROJECT_STRUCTURE.md)
>
> 🏷️ **难度**：中级 · **时长**：约 25 分钟 · **前置**：[05 代理](05-agents.md)

学会写链之后，下一步是把链变成**可被其他程序调用的服务**。本章用 **LangServe**（基于 FastAPI）把链暴露为 HTTP API。

## 本章目标

- 理解 LangServe 的作用：把任意 `Runnable` 自动变成 REST API + 交互式 Playground。
- 能写一个 `serve.py` 用 `add_routes` 注册链。
- 能本地启动并用 `/playground` 调试、用 `/invoke` 调用。

## 核心概念

### 1. 为什么要服务化

Jupyter / 脚本只在你本机跑。要让前端、其他服务、同事使用你的链，就需要 HTTP 接口。LangServe 在 FastAPI 之上自动生成：

- `POST /{path}/invoke`：单次调用
- `POST /{path}/batch`：批量
- `POST /{path}/stream`：流式
- `GET /{path}/playground`：可视化调试界面
- `GET /{path}/input_schema`、`/output_schema`：接口契约

### 2. 基本结构

一个 `serve.py` 通常包含：

- 构造你的 Runnable（复用前几章的链）；
- 创建 FastAPI `app`；
- 用 `add_routes(app, runnable, path="/my-chain")` 注册；
- 用 `uvicorn` 启动。

### 3. 配置与可观测

- 在 `.env` 中管理模型 Key，不要硬编码进服务代码。
- 开启 LangSmith（`LANGCHAIN_TRACING_V2=true`）后，线上每次调用都能在后台追溯，便于排查。
- 生产部署需自行加鉴权、限流、健康检查（LangServe 只负责暴露接口）。

### 4. 用 Docker 部署

`Dockerfile` 是多阶段、non-root 镜像，已内置 `HEALTHCHECK` 探测 `/health`：

```bash
docker build -t agent-study:latest .
docker run -d -p 8000:8000 \
  -v $(pwd)/data/chroma:/app/data/chroma \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  agent-study:latest
```

- 默认启动 `06_langserve.py`；访问 <http://localhost:8000/chain/playground>。
- **必须**通过 `-e OPENAI_API_KEY=...` 提供密钥，否则服务启动即校验失败、健康检查也失败。
- 切换 Jupyter：`docker run -p 8888:8888 -e CMD=jupyter agent-study:latest`。

## 练习任务

1. 把第 2 章的 LCEL 链封装成一个 Runnable。
2. 写 `examples/06_langserve.py`，用 `add_routes` 注册到 `/chain`。
3. 本地 `uvicorn` 启动，打开 `/chain/playground` 试玩。
4. 用 `curl` 或 Python `requests` 调用 `/chain/invoke` 验证。

## 常见坑

- `langserve` / `fastapi` / `uvicorn` 未安装，先补 `requirements.txt` 中对应依赖。
- 链的输入输出与注册的 path 不匹配导致 422；用 `/input_schema` 核对。
- 忘记激活虚拟环境，导致模块找不到。

## 延伸阅读

- LangServe 官方文档与示例仓库。
- 进阶：把 Agent、RAG 链都注册为服务；用容器（Docker）打包部署。
