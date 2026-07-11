# 目录结构与模块说明（Project Structure）

> 🌐 **English version**: [PROJECT_STRUCTURE.en.md](/en/PROJECT_STRUCTURE/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [环境搭建](ENV_SETUP.md) · [ARCHITECTURE 架构总览](ARCHITECTURE.md)
>
> 🏷️ **类型**：项目地图 · **时长**：约 5 分钟 · **前置**：无

本文件说明项目每个目录/文件的用途，以及你在学习过程中应当**亲手创建**的内容。文档不替你写代码，只指明"应该写出什么"。

## 顶层文件

| 路径 | 作用 |
| --- | --- |
| `README.md` | 项目总览与快速开始 |
| `requirements.txt` | 依赖清单（已提供） |
| `.env.example` | 环境变量模板（已提供，需复制为 `.env`） |
| `.gitignore` | 忽略规则（已提供） |

## `docs/` 学习文档（已提供）

| 文件 | 内容 |
| --- | --- |
| `LEARNING_GUIDE.md` | 学习路线总纲与里程碑 |
| `ENV_SETUP.md` | 环境搭建步骤 |
| `PROJECT_STRUCTURE.md` | 本文件 |
| `01-models-and-prompts.md` | 模型与提示词 |
| `02-chains.md` | 链 |
| `03-memory.md` | 记忆 |
| `04-retrieval-and-rag.md` | 检索与 RAG |
| `05-agents.md` | 代理 |
| `06-langserve-and-deployment.md` | 服务化部署 |

## `notebooks/`（已提供）

按章节放置 Jupyter 笔记本，**用于探索和实验**：

```
notebooks/
├── 00_getting_started.ipynb
├── 01_models_and_prompts.ipynb
├── 02_chains.ipynb
├── 03_memory.ipynb
├── 04_retrieval_and_rag.ipynb
├── 05_agents.ipynb
└── 06_langserve_and_deployment.ipynb
```

笔记本里建议：代码单元格写实现，Markdown 单元格写"你理解的要点"和"踩坑记录"。
0~6 共 7 个笔记本均已提供；如需追加练习，可新建 `0x_your_topic.ipynb`。

## `examples/`（已提供）

放置**可独立运行的脚本**，比笔记本更偏工程化：

```
examples/
├── _common.py                # 公共工具：环境变量加载、LLM/Embeddings 工厂、format_docs、_safe_eval
├── 00_check.py               # 前导脚本：环境验证（先跑这个）
├── 01_models_prompts.py      # 模型与提示词
├── 02_chains.py              # 链（LCEL）
├── 03_memory.py              # 记忆（入口：默认演示 LangGraph 版）
├── 03_memory_graph.py       # 记忆 · LangGraph 风格（推荐，1.x）
├── 03_memory_runnable.py    # 记忆 · 老 API 对照（RunnableWithMessageHistory，已废弃）
├── 04_rag.py                 # 检索与 RAG
├── 05_agents.py              # 代理
├── 06_langserve.py           # 服务化（LangServe）
├── 07_ollama_local.py        # 本地模型（Ollama，零成本）
├── 08_qwen.py                # 通义千问（DashScope 兼容模式）
├── 09_caching.py            # 缓存层（InMemory / SQLite）
├── 10_rag_eval.py          # RAG 评估（上下文命中率 + 可选 RAGAS）
└── 11_observability.py     # 可观测性实战（token 计数 + LangSmith + OTel）
```

每个脚本应能在激活虚拟环境后，通过 `python examples/0x_xxx.py` 直接运行。
`00_check.py` 是前导脚本，建议每次改完 `.env` 都先跑一次确认环境。
`07_ollama_local.py` 与 `08_qwen.py` 属于**模型分支示例**，可按需使用，不影响主线 0~6 学习。

## `data/`（部分运行时生成）

- `data/docs/`：放你用于 RAG 练习的 PDF / Markdown / TXT（**已纳入版本控制**）。
- `data/chroma/`：OpenAI 嵌入的 Chroma 持久化目录（已被 `.gitignore` 忽略）。
- `data/chroma_ollama/`：Ollama 嵌入的 Chroma 持久化目录（已被 `.gitignore` 忽略）。

## `tests/`（可选）

学习后期可为自己的 `examples/` 写少量 `pytest` 用例，验证链的输入输出符合预期。

## `web/`（前端在线学习平台）

基于 **React 18 + TypeScript + Vite** 的现代化在线学习平台前端，与本项目学习路线深度结合。
详细文档见 [WEB_FRONTEND.md](WEB_FRONTEND.md)。

```
web/
├── public/favicon.svg        # 站点图标
├── src/
│   ├── components/           # ui（基础原语）/ layout（布局）/ course（课程）/ player（播放器）
│   ├── pages/                # 页面：首页/课程/详情/学习/登录/注册/个人中心/进度/404
│   ├── store/                # 状态管理：AuthContext / ProgressContext / ThemeContext
│   ├── data/                 # 课程与分类 mock 数据
│   ├── utils/                # localStorage 封装、格式化、多维筛选纯函数
│   ├── styles/               # 模块化 CSS（base / header / home / courses / learn / account / responsive）
│   ├── types/                # 全局 TS 类型
│   ├── App.tsx               # 路由表
│   ├── main.tsx              # 入口（Provider + Router）
│   └── index.css             # 样式入口（@import 聚合）
├── index.html · vite.config.ts · tsconfig.json · package.json · README.md
```

- `npm run dev` 启动开发服务器（默认 `http://localhost:5173`）。
- `npm run build` 执行类型检查并产出静态文件到 `web/dist/`。
- 状态集中在 `src/store/`：登录态、学习进度（按用户隔离）、主题，均持久化到 `localStorage`。

## 命名约定

- 章节编号 `01~06` 与 `docs/` 文档一一对应，方便回查。
- 笔记本重探索、脚本重工程，二者互补，不要求完全一致。
