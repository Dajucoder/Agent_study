# 目录结构与模块说明（Project Structure）

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

## `notebooks/`（你创建）

按章节放置 Jupyter 笔记本，**用于探索和实验**：

```
notebooks/
├── 00_check.ipynb          # 环境验证
├── 01_models_prompts.ipynb
├── 02_chains.ipynb
├── 03_memory.ipynb
├── 04_rag.ipynb
├── 05_agents.ipynb
└── 06_langserve.ipynb
```

笔记本里建议：代码单元格写实现，Markdown 单元格写"你理解的要点"和"踩坑记录"。

## `examples/`（你创建）

放置**可独立运行的脚本**，比笔记本更偏工程化：

```
examples/
├── 01_simple_chat.py
├── 02_prompt_template.py
├── 03_lcel_chain.py
├── 04_conversational_memory.py
├── 05_rag_qa.py
├── 06_custom_agent.py
└── 07_serve.py            # LangServe 入口（进阶）
```

每个脚本应能在激活虚拟环境后，通过 `python examples/0x_xxx.py` 直接运行。

## `data/`（运行时生成，已被 git 忽略）

- `data/docs/`：放你用于 RAG 练习的 PDF / Markdown / TXT。
- `data/chroma/`：Chroma 向量库持久化目录（运行 RAG 后自动生成）。

## `tests/`（可选）

学习后期可为自己的 `examples/` 写少量 `pytest` 用例，验证链的输入输出符合预期。

## 命名约定

- 章节编号 `01~06` 与 `docs/` 文档一一对应，方便回查。
- 笔记本重探索、脚本重工程，二者互补，不要求完全一致。
