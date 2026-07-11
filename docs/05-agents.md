# 05 · 代理（Agents）

> 🌐 **English version**: [05-agents.en.md](/en/05-agents/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [📚 学习路线](LEARNING_GUIDE.md) · 上一章：[04 检索与 RAG](04-retrieval-and-rag.md) · 下一章：[06 服务化与部署](06-langserve-and-deployment.md) · 相关：[04 检索与 RAG](04-retrieval-and-rag.md) · [06 服务化与部署](06-langserve-and-deployment.md)
>
> 🏷️ **难度**：中级 · **时长**：约 30 分钟 · **前置**：[04 检索与 RAG](04-retrieval-and-rag.md)

当任务步骤不可预知（需要"看情况"决定下一步），就用 **Agent**：让 LLM 自己决定调用哪些工具、调用顺序如何。

## 本章目标

- 理解 Agent 与 Chain 的区别：Chain 是固定流程，Agent 是"模型驱动的动态决策"。
- 能定义并注册自定义工具（Tool）。
- 能用现代 `create_tool_calling_agent` / `AgentExecutor` 跑通一个智能体。

## 核心概念

### 1. 工具（Tools）

工具是 Agent 的"手"。任何 Python 函数，只要描述清楚"做什么、参数什么"，就能作为工具：

- 可以是查天气、算数、查数据库、调用搜索 API；
- 关键是**清晰的描述与参数 schema**，模型靠描述决定要不要调用。

### 2. Agent 的运作循环

1. 把"问题 + 可用工具列表"给模型；
2. 模型决定：直接回答，或调用某个工具（并给出参数）；
3. 执行工具，把结果回传给模型；
4. 模型根据结果继续决策，直到能给出最终答案。

这就是"思考 → 行动 → 观察"的循环。

### 3. AgentExecutor

`AgentExecutor` 负责驱动上述循环：管理步骤上限、异常处理、把中间结果回灌给模型。务必设置合理的最大步数，避免无限循环。

### 4. 现代推荐：Tool Calling

新版 LangChain 推荐基于模型的"工具调用（function calling）"能力（如 `create_tool_calling_agent`），比旧版 ReAct 文本解析更稳定。

## 练习任务

1. 定义一个"计算器"工具（加减乘除），注册给 Agent。
2. 定义一个"获取当前时间"工具，让 Agent 在回答中正确使用。
3. 组合多个工具，观察模型如何自主决定调用顺序。
4. 设置 `max_iterations`，测试模型"走投无路"时的终止行为。

## 常见坑

- 工具描述写得太含糊，模型不会调用或调错；描述要像"给同事看的说明"。
- 没有步数上限，模型可能陷入无效循环、烧钱；务必配 `max_iterations`。
- 工具内部异常要兜底，否则会中断整个 Agent 执行。
- **绝不要用 `eval` / `exec` / `os.system` 等执行任意代码**——即便加了 `__builtins__` 黑名单、也仍能被 `().__class__.__base__.__subclasses__()` 等方式绕过。本项目用基于 AST 白名单的安全计算器（见 `examples/_common.py::_safe_eval`），仅接受数字、`+ - * /` 与括号；非法节点会立刻抛 `ValueError`。

## 延伸阅读

- LangChain 官方 "Agents" 文档与 "Tools" 文档。
- 进阶：多工具规划、Agent 间协作、给 Agent 接 RAG 作为"知识工具"。
