# 常见问题与排查（Troubleshooting / FAQ）

> 🌐 **English version**: [TROUBLESHOOTING.en.md](/en/TROUBLESHOOTING/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [环境搭建](ENV_SETUP.md) · 相关：[01 模型与提示词](01-models-and-prompts.md) · [04 检索与 RAG](04-retrieval-and-rag.md)
>
> 🏷️ **类型**：排错手册 · **时长**：随时查阅 · **前置**：[环境搭建](ENV_SETUP.md)

> 把"踩过的坑"集中到一处。**先看本节，再去提 Issue。**

## 安装与环境

### Q: `pip install -r requirements.txt` 报 `error: Microsoft Visual C++ 14.0 or greater is required`
**A:** `chromadb` 在 Windows 上需要 C++ 编译器。
- 简单方案：改用 `conda install -c conda-forge chromadb` 或换 FAISS（`faiss-cpu`）。
- 长期方案：安装 [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)。

### Q: `ModuleNotFoundError: No module named 'langchain_openai'`
**A:** 依赖没装全或装到了别的环境。确认：
```bash
which python
pip list | grep langchain
```
建议用 `requirements.lock` 锁版本安装。

### Q: `ImportError: cannot import name 'AgentExecutor' from 'langchain.agents'`
**A:** langchain 1.x 把 `AgentExecutor` 移到了 `langchain_classic`。请确保已升级到最新 `05_agents.py`（已用 `try/except` 兼容 0.x/1.x）。或安装：
```bash
pip install langchain-classic
```

## API Key 与认证

### Q: `AuthenticationError: Incorrect API key provided`
**A:**
- `.env` 中的 `OPENAI_API_KEY` 是否以 `sk-` 开头且无多余空格
- 复制粘贴时是否多带了引号
- 是否在对应平台（OpenAI / Azure / 第三方）正确启用

### Q: `openai.APIConnectionError`
**A:** 网络或代理问题。
- 若使用第三方 OpenAI 兼容服务，在 `.env` 设置 `OPENAI_API_BASE=https://your-provider.com/v1`
- 临时用 `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"` 验证网络

## RAG 与向量库

### Q: `FileNotFoundError: data/docs/sample.txt`
**A:** `.gitignore` 已改进，`data/docs/sample.txt` 现在应纳入版本库。如果 `git pull` 后仍找不到：
```bash
git ls-files | grep sample.txt    # 确认是否进库
# 如果是空，重新下载：
curl -L https://raw.githubusercontent.com/Dajucoder/Agent_study/main/data/docs/sample.txt -o data/docs/sample.txt
```

### Q: `Chroma ... persist_directory ... sqlite3 ...`
**A:** 损坏的向量库。删除重建：
```bash
rm -rf data/chroma
python examples/04_rag.py
```

### Q: 第三方 OpenAI 端点 + OpenAI 专有 embedding 报错
**A:** 你的 `.env` 配的是 `OPENAI_EMBEDDING_MODEL=text-embedding-v1`（通义千问），但通过 OpenAI 兼容端点调用。请改成对应服务商提供的 embedding：
- 阿里通义：`text-embedding-v3`（DashScope SDK）
- 智谱：`embedding-2`
- OpenAI 官方：`text-embedding-3-small`

## LangServe / 部署

### Q: `langserve` 启动后 `curl localhost:8000/chain/invoke` 422
**A:** 输入字段对不上。看 `/chain/input_schema`：
```bash
curl http://localhost:8000/chain/input_schema
```

### Q: 前端调 API 报 CORS 错误
**A:** `06_langserve.py` 已加 CORS 中间件，默认 `allow_origins=["*"]`。生产请收紧到具体域名。

## 性能与限流

### Q: `RateLimitError: Rate limit reached for ...`
**A:** 见 [COST_AND_LIMITS.md](COST_AND_LIMITS.md)。三条策略：
1. 减少并发（`max_concurrency`）
2. 启用缓存
3. 升级 OpenAI usage tier

### Q: 跑 `04_rag.py` 一次就烧掉 $0.5
**A:** 通常是每次都重建向量库。本项目已在 `04_rag.py` 加 "已存在则加载" 逻辑；如仍烧钱，检查 `data/chroma` 是否被误删。

## 其他

### Q: Notebook 启动时 `Kernel not found`
**A:**
```bash
pip install ipykernel
python -m ipykernel install --user --name=agent-study
```

### Q: 在哪里提问？
- **文档/示例问题**：开 [Discussion](../../discussions)
- **明确 Bug**：[Bug Report Issue](../../issues/new/choose)
- **安全漏洞**：见 [SECURITY.md](../SECURITY.md)
