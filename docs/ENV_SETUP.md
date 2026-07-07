# 环境搭建（Environment Setup）

> 🌐 **English version**: [ENV_SETUP.en.md](ENV_SETUP.en.md)

本章带你在本地把项目跑起来，并能成功调用一次大模型。请严格按步骤操作。

## 1. 确认 Python 版本

要求 **Python 3.10 及以上**。在终端执行：

```bash
python --version
# 期望输出类似：Python 3.11.x
```

若版本过低，请用 pyenv、官方安装包或 conda 升级。

## 2. 使用已有虚拟环境

本仓库已包含 `.venv` 虚拟环境目录（位于项目根目录）。激活方式：

**Windows (PowerShell):**
```powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
source .venv/bin/activate
```

激活后命令行前缀会出现 `(.venv)`。若需重新创建虚拟环境：

```bash
python -m venv .venv
```

## 3. 安装依赖

```bash
pip install -r requirements.txt
```

若下载缓慢，可临时使用国内镜像：
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## 4. 配置 API Key

复制环境变量模板并填写你的密钥：

```bash
cp .env.example .env
```

用编辑器打开 `.env`，把 `OPENAI_API_KEY` 改为你的真实 Key（以 `sk-` 开头）。**切勿把 `.env` 提交到 git**（已在 `.gitignore` 中忽略）。

## 5. 验证环境

在 Python 交互环境或新建 `notebooks/00_check.ipynb` 中验证：

1. 能加载 `.env` 中的配置。
2. 能调用一次 `ChatOpenAI` 并得到回复。
3. 若使用 LangSmith，把 `LANGCHAIN_TRACING_V2` 设为 `true` 后调用能在后台看到链路。

> 具体调用写法参见 [01-models-and-prompts.md](01-models-and-prompts.md)，本文档只负责把环境打通。

## 6. 启动 Jupyter（推荐）

```bash
jupyter notebook
# 或
jupyter lab
```

浏览器打开后，在 `notebooks/` 下新建笔记本开始练习。

## 常见问题

- **`ModuleNotFoundError`**：确认虚拟环境已激活，且 `pip install` 没有报错。
- **`AuthenticationError`**：检查 `.env` 中的 `OPENAI_API_KEY` 是否正确、是否含多余空格。
- **`ImportError: cannot import name ...`**：多为版本不匹配，按 `requirements.txt` 固定版本重装。
- **网络超时**：确认能访问 API 基址；使用代理时配置 `OPENAI_API_BASE`。
