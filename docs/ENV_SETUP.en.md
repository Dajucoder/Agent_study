# Environment Setup

> 🌐 **中文版**: [ENV_SETUP.md](ENV_SETUP.md)

This chapter walks you through getting the project running locally and successfully calling a model. Please follow the steps strictly.

## 1. Verify Python Version

**Python 3.10+ is required.** Run in the terminal:

```bash
python --version
# Expected output similar to: Python 3.11.x
```

If the version is too low, use pyenv, the official installer, or conda to upgrade.

## 2. Use the Existing Virtual Environment

This repo includes a `.venv` directory (in the project root). Activate it:

**Windows (PowerShell):**
```powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
source .venv/bin/activate
```

After activation, the command prompt will have a `(.venv)` prefix. To recreate the venv:

```bash
python -m venv .venv
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If downloads are slow, use a domestic mirror:

```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

For reproducible installs, use the lock file:

```bash
pip install -r requirements.lock
```

## 4. Configure API Key

Copy the env template and fill in your key:

```bash
cp .env.example .env
```

Open `.env` in an editor and change `OPENAI_API_KEY` to your real key (starts with `sk-`). **Never commit `.env` to git** (already in `.gitignore`).

### Third-party OpenAI-compatible services

If you use a third-party OpenAI-compatible service (e.g. `aiping.cn`, DeepSeek, Moonshot), set `OPENAI_API_BASE` to their endpoint URL:

```ini
OPENAI_API_KEY=your-key
OPENAI_API_BASE=https://your-provider.com/v1
OPENAI_MODEL=their-model-name
OPENAI_EMBEDDING_MODEL=their-embedding-name
```

> ⚠️ Not all features work with third-party services: some don't support `function calling` (affects `05_agents.py`), and embedding models must match the provider.

## 5. Verify Environment

In the Python REPL or a new `notebooks/00_check.ipynb`:

1. Can load the config from `.env`.
2. Can call `ChatOpenAI` once and get a reply.
3. If using LangSmith, set `LANGCHAIN_TRACING_V2=true` and you'll see the trace in the dashboard.

> See [01-models-and-prompts.md](01-models-and-prompts.md) for the actual call syntax. This document focuses on environment setup.

## 6. Start Jupyter (recommended)

```bash
jupyter notebook
# or
jupyter lab
```

Open in a browser, create a new notebook under `notebooks/` and start practicing.

## FAQ

- **`ModuleNotFoundError`**: Make sure the venv is activated and `pip install` had no errors.
- **`AuthenticationError`**: Check that `OPENAI_API_KEY` in `.env` is correct and has no extra spaces.
- **`ImportError: cannot import name ...`**: Usually a version mismatch; reinstall with `requirements.lock`.
- **Network timeout**: Confirm you can reach the API base; configure `OPENAI_API_BASE` if using a proxy.
