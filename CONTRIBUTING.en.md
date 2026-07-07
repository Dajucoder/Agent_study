# Contributing

> 🌐 **中文版**: [CONTRIBUTING.md](CONTRIBUTING.md)

Thanks for considering contributing to this project! 🎉

This project is mainly a **personal LangChain learning repository**, but all forms of feedback are welcome: open an Issue, fix typos, supplement doc examples, share better practices.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What Can I Contribute](#what-can-i-contribute)
- [Development Flow](#development-flow)
- [Code Style](#code-style)
- [Commit Convention](#commit-convention)
- [Pull Request Checklist](#pull-request-checklist)

## Code of Conduct

By participating in this project, you agree to abide by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## What Can I Contribute

| Type | Use Case |
| --- | --- |
| 🐛 Report a Bug | Example errors, doc vs. reality mismatch, API call failures, etc. |
| ✨ Suggest an Improvement | New examples, optimize docs, add tests, refactor code |
| 📖 Improve Docs | Typos, unclear expression, missing images, missing links |
| 🧪 Add Tests | Add coverage under `tests/` |
| 🔧 Fix Small Issues | Typos, broken links, version number inconsistency |

## Development Flow

### 1. Fork & Clone
```bash
git clone https://github.com/<your-name>/Agent_study.git
cd Agent_study
```

### 2. Create a Branch
```bash
git checkout -b type/short-description
# e.g.: git checkout -b docs/fix-typo-in-rag
```

Branch types: `feat` / `fix` / `docs` / `refactor` / `test` / `chore`.

### 3. Configure Environment
```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.lock
pip install ruff pytest mypy bandit pre-commit
pre-commit install          # optional, enables pre-commit hook
```

### 4. Modify Code
- Make incremental changes. Before committing, run:
  ```bash
  ruff check .
  pytest tests/ -q
  mypy examples/ tests/
  ```

### 5. Commit & Push
```bash
git add -A
git commit -m "type(scope): short description"
git push origin <branch-name>
```

### 6. Open a Pull Request
- Use [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) to fill in
- Link the related Issue (`Closes #123` / `Refs #456`)
- Wait for Review after CI turns green

## Code Style

- **Python**: follow PEP 8 + type hints; use `ruff` (`ruff check .` / `ruff format .`)
- **Comments / docs**: primarily in Chinese; identifiers in English
- **Commit granularity**: one commit does one thing
- **New files**:
  - Example code in `examples/`, named `NN_xxx.py`
  - Docs in `docs/`, with chapter prefix; also add the `.en.md` English version
  - Tests in `tests/`, files start with `test_`

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Common types:
- `feat`: new feature
- `fix`: bug fix
- `docs`: docs only
- `refactor`: code change that neither fixes a bug nor adds a feature
- `test`: tests only
- `chore`: misc (build, CI, dependencies, etc.)

Example:
```
feat(examples): add Ollama local model example
fix(04_rag): fix vector store path compatibility on Windows
docs(readme): add Ollama deployment instructions
```

## Pull Request Checklist

Before submitting, confirm:

- [ ] Code passes `ruff check .`
- [ ] Tests pass `pytest tests/ -q`
- [ ] New feature has corresponding `examples/` or `notebooks/`
- [ ] Docs / comments updated
- [ ] Commit messages follow Conventional Commits
- [ ] PR description explains: motivation, change, impact, screenshots (if any)
- [ ] English docs updated (if changing Chinese docs)

---

Thanks again for your contribution! 💖
