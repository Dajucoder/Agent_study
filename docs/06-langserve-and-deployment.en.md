# 06 · Serving & Deployment (LangServe)

> 🌐 **中文版**: [06-langserve-and-deployment.md](06-langserve-and-deployment.md)

After learning to write chains, the next step is turning them into **services that other programs can call**. This chapter uses **LangServe** (built on FastAPI) to expose chains as HTTP APIs.

## Goals

- Understand LangServe's role: auto-turn any `Runnable` into a REST API + interactive Playground.
- Write a `serve.py` that uses `add_routes` to register a chain.
- Run it locally and use `/playground` to debug, `/invoke` to call.

## Core Concepts

### 1. Why Service-ize

Jupyter / scripts only run on your machine. To let the frontend, other services, or colleagues use your chain, you need an HTTP interface. LangServe automatically generates, on top of FastAPI:

- `POST /{path}/invoke`: single call
- `POST /{path}/batch`: batch
- `POST /{path}/stream`: streaming
- `GET /{path}/playground`: visual debug UI
- `GET /{path}/input_schema`, `/output_schema`: interface contract

### 2. Basic Structure

A typical `serve.py` contains:

- Build your Runnable (reusing chains from earlier chapters).
- Create a FastAPI `app`.
- Register with `add_routes(app, runnable, path="/my-chain")`.
- Start with `uvicorn`.

### 3. Configuration & Observability

- Manage model keys in `.env`, never hardcode in service code.
- After enabling LangSmith (`LANGCHAIN_TRACING_V2=true`), every online call is traceable in the dashboard for easier debugging.
- For production deployment, you need to add auth, rate limiting, health checks yourself (LangServe only exposes the interface).

## Exercises

1. Wrap the LCEL chain from chapter 2 into a Runnable.
2. Write `examples/06_langserve.py`, register it at `/chain` with `add_routes`.
3. Start `uvicorn` locally; open `/chain/playground` to play.
4. Use `curl` or Python `requests` to call `/chain/invoke` to verify.

## Common Pitfalls

- `langserve` / `fastapi` / `uvicorn` not installed — add them from `requirements.txt` first.
- Chain's input / output doesn't match the registered path, causing 422; use `/input_schema` to verify.
- Forgot to activate the venv, leading to "module not found".
- CORS not enabled when the frontend calls from another origin; `examples/06_langserve.py` already adds a permissive CORS middleware for development (tighten in production).

## Further Reading

- LangServe official docs and example repo.
- Advanced: register Agent / RAG chains as services; package deployment with Docker.
