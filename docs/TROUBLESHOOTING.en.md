# FAQ & Troubleshooting

> 🌐 **中文版**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
>
> 🧭 **Navigate** · [🏠 Home](/en/index/) · [ENV_SETUP](/en/ENV_SETUP/) · Related：[01 Models & Prompts](/en/01-models-and-prompts/) · [04 Retrieval & RAG](/en/04-retrieval-and-rag/)
>
> 🏷️ **Type**: Troubleshooting · **Time**: on-demand · **Prereq**: [ENV_SETUP](/en/ENV_SETUP/)

> Consolidating "the pitfalls you've stepped on" in one place. **Check this section before opening an issue.**

## Installation & Environment

### Q: `pip install -r requirements.txt` reports `error: Microsoft Visual C++ 14.0 or greater is required`
**A:** `chromadb` needs a C++ compiler on Windows.
- Quick fix: use `conda install -c conda-forge chromadb` or switch to FAISS (`faiss-cpu`).
- Long-term: install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

### Q: `ModuleNotFoundError: No module named 'langchain_openai'`
**A:** Dependencies aren't fully installed, or installed into a different environment. Confirm:
```bash
which python
pip list | grep langchain
```
Recommend installing with the locked `requirements.lock`.

### Q: `ImportError: cannot import name 'AgentExecutor' from 'langchain.agents'`
**A:** LangChain 1.x moved `AgentExecutor` to `langchain_classic`. Make sure you're on the latest `05_agents.py` (already uses `try/except` to support 0.x/1.x). Or install:
```bash
pip install langchain-classic
```

## API Key & Auth

### Q: `AuthenticationError: Incorrect API key provided`
**A:**
- `OPENAI_API_KEY` in `.env` should start with `sk-` and have no extra spaces.
- Did you accidentally include quotes when copying?
- Is it enabled on the corresponding platform (OpenAI / Azure / third-party)?

### Q: `openai.APIConnectionError`
**A:** Network or proxy issue.
- If using a third-party OpenAI-compatible service, set `OPENAI_API_BASE=https://your-provider.com/v1` in `.env`.
- Quickly verify the network with `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`.

## RAG & Vector Store

### Q: `FileNotFoundError: data/docs/sample.txt`
**A:** `.gitignore` has been improved; `data/docs/sample.txt` is now in version control. If it's still missing after `git pull`:
```bash
git ls-files | grep sample.txt    # Check whether it's in the repo
# If empty, re-download:
curl -L https://raw.githubusercontent.com/Dajucoder/Agent_study/main/data/docs/sample.txt -o data/docs/sample.txt
```

### Q: `Chroma ... persist_directory ... sqlite3 ...`
**A:** Corrupted vector store. Delete and rebuild:
```bash
rm -rf data/chroma
python examples/04_rag.py
```

### Q: Third-party OpenAI endpoint + OpenAI-specific embedding fails
**A:** Your `.env` is configured with `OPENAI_EMBEDDING_MODEL=text-embedding-v1` (Qwen), but called through the OpenAI-compatible endpoint. Change to the corresponding provider's embedding:
- Qwen (Alibaba): `text-embedding-v3` (DashScope SDK)
- Zhipu: `embedding-2`
- OpenAI official: `text-embedding-3-small`

## LangServe / Deployment

### Q: After `langserve` starts, `curl localhost:8000/chain/invoke` returns 422
**A:** Input fields don't match. Check `/chain/input_schema`:
```bash
curl http://localhost:8000/chain/input_schema
```

### Q: Frontend calling the API gets a CORS error
**A:** `06_langserve.py` has CORS middleware, default `allow_origins=["*"]`. Tighten to specific domains in production.

## Performance & Rate Limits

### Q: `RateLimitError: Rate limit reached for ...`
**A:** See [COST_AND_LIMITS.md](COST_AND_LIMITS.md). Three strategies:
1. Reduce concurrency (`max_concurrency`).
2. Enable caching.
3. Upgrade OpenAI usage tier.

### Q: Running `04_rag.py` once burns $0.5
**A:** Usually rebuilding the vector store every time. This project already has "load if exists" in `04_rag.py`; if it still costs a lot, check if `data/chroma` was accidentally deleted.

## Other

### Q: Notebook startup says "Kernel not found"
**A:**
```bash
pip install ipykernel
python -m ipykernel install --user --name=agent-study
```

### Q: Where to ask questions?
- **Doc / example questions**: open a [Discussion](../../discussions)
- **Confirmed bug**: [Bug Report Issue](../../issues/new/choose)
- **Security vulnerability**: see [SECURITY.md](../SECURITY.md)
