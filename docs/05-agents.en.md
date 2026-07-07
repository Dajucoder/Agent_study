# 05 · Agents

> 🌐 **中文版**: [05-agents.md](05-agents.md)

When the task's steps are unpredictable (you need to "play it by ear"), use **Agent**: let the LLM itself decide which tools to call and in what order.

## Goals

- Understand the difference between Agent and Chain: Chain is a fixed flow, Agent is "model-driven dynamic decision-making".
- Define and register custom tools.
- Run an agent with the modern `create_tool_calling_agent` / `AgentExecutor`.

## Core Concepts

### 1. Tools

Tools are the Agent's "hands". Any Python function with a clear description of "what it does and what parameters" can be a tool:

- Can be weather lookup, math, database query, search API.
- The key is **a clear description and parameter schema** — the model decides whether to call based on the description.

### 2. Agent's Loop

1. Give the model "the question + the list of available tools".
2. The model decides: answer directly, or call a tool (with parameters).
3. Execute the tool, return the result to the model.
4. The model continues to decide based on the result until it can give a final answer.

This is the "think → act → observe" loop.

### 3. AgentExecutor

`AgentExecutor` drives the loop above: manages step limits, exception handling, and feeds intermediate results back to the model. Always set a reasonable max-steps to avoid infinite loops.

### 4. Modern Recommendation: Tool Calling

Newer LangChain recommends the model's native "function calling" capability (e.g. `create_tool_calling_agent`), which is more stable than the old ReAct text parsing.

## Exercises

1. Define a "calculator" tool (add / sub / mul / div) and register it with the Agent.
2. Define a "get current time" tool and let the Agent use it correctly in answers.
3. Combine multiple tools; observe how the model autonomously decides the call order.
4. Set `max_iterations` and test the termination behavior when the model is "out of options".

## Common Pitfalls

- Tool descriptions are too vague — the model won't call or calls incorrectly; descriptions should read like "instructions to a colleague".
- No step limit — the model can get stuck in an invalid loop, burning money; always set `max_iterations`.
- Internal exceptions in tools need fallback, otherwise they interrupt the entire Agent run.
- **Never use `eval` / `exec` / `os.system`** to execute arbitrary code — even with `__builtins__` blacklisting, you can still bypass with `().__class__.__base__.__subclasses__()` etc. This project uses an AST whitelist-based safe calculator (see `examples/_common/_safe_eval`), which only accepts numbers, `+ - * /` and parentheses; illegal nodes immediately raise `ValueError`.

## Further Reading

- LangChain "Agents" and "Tools" docs.
- Advanced: multi-tool planning, inter-agent collaboration, attaching RAG as a "knowledge tool" for an Agent.
