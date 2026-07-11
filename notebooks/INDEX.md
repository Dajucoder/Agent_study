# 笔记本导航（Notebooks Index）

> 🌐 **English version**: [INDEX.en.md](INDEX.en.md)
>
> 🧭 **导航** · [🏠 项目首页](../README.md) · [示例导航](../examples/INDEX.md) · [文档站](../docs/index.md)
>
> 🏷️ **类型**：笔记本入口 · **适合**：喜欢交互式学习的读者

`notebooks/` 下提供 **7 个** Jupyter 笔记本（编号 `0~6`），与 `examples/` 的脚本一一对应，适合边看边跑、实时改参数。

> 运行方式：
> ```bash
> jupyter notebook notebooks/00_getting_started.ipynb
> # 或在 VS Code 中直接打开 .ipynb 运行
> ```

## 笔记本一览

| 笔记本 | 主题 | 难度 | 对应示例 | 适合谁 |
| --- | --- | --- | --- | --- |
| [00_getting_started.ipynb](00_getting_started.ipynb) | 入门：环境、第一个 LLM 调用、基础概念 | 入门 | `00_check.py` | 零基础新手 |
| [01_models_and_prompts.ipynb](01_models_and_prompts.ipynb) | 模型与提示词工程 | 入门 | `01_models_prompts.py` | 想练提示词的人 |
| [02_chains.ipynb](02_chains.ipynb) | 链（LCEL）组合 | 入门 | `02_chains.py` | 想拼管道的人 |
| [03_memory.ipynb](03_memory.ipynb) | 记忆（多轮对话上下文） | 初级 | `03_memory_graph.py` | 想做聊天机器人的人 |
| [04_retrieval_and_rag.ipynb](04_retrieval_and_rag.ipynb) | 检索与 RAG | 中级 | `04_rag.py` | 想做知识库问答的人 |
| [05_agents.ipynb](05_agents.ipynb) | 代理（工具调用） | 中级 | `05_agents.py` | 想做自主任务的人 |
| [06_langserve_and_deployment.ipynb](06_langserve_and_deployment.ipynb) | 服务化与部署 | 进阶 | `06_langserve.py` | 想上线 API 的人 |

## 与示例的关系

- **笔记本 = 教学版**：分步讲解、每步有输出和注释，适合学习。
- **示例脚本 = 工程版**：结构紧凑、带 `main()` 入口与自检断言，适合直接跑和复用。
- 推荐先过一遍对应笔记本，再回到 `examples/` 看"生产化"写法。

> 提交前请用 `nbstripout` 清掉输出单元格（避免 diff 噪声），命令：`nbstripout notebooks/*.ipynb`。
