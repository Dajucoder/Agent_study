# 贡献指南（Contributing）

感谢你考虑为本项目做出贡献！🎉

本项目主要定位是 **LangChain 个人学习仓库**，但欢迎任何形式的反馈：提 Issue、改正错别字、补全文档示例、分享更好的实践。

## 目录

- [行为准则](#行为准则)
- [我能贡献什么](#我能贡献什么)
- [开发流程](#开发流程)
- [代码风格](#代码风格)
- [提交规范](#提交规范)
- [Pull Request 检查清单](#pull-request-检查清单)

## 行为准则

参与本项目即表示你同意遵守 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

## 我能贡献什么

| 类型 | 适合场景 |
|---|---|
| 🐛 报告 Bug | 跑示例报错、文档描述与实际不符、API 调用失败等 |
| ✨ 提改进建议 | 新增示例、优化文档、补充测试、重构代码 |
| 📖 完善文档 | 错别字、表达不清、缺图、缺链接 |
| 🧪 补测试 | `tests/` 下增加覆盖 |
| 🔧 修小问题 | typo、失效链接、版本号不一致 |

## 开发流程

### 1. Fork & Clone
```bash
git clone https://github.com/<your-name>/Agent_study.git
cd Agent_study
```

### 2. 创建分支
```bash
git checkout -b type/short-description
# 例：git checkout -b docs/fix-typo-in-rag
```

分支类型：`feat` / `fix` / `docs` / `refactor` / `test` / `chore`。

### 3. 配置环境
```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.lock
pip install ruff pytest
```

### 4. 修改代码
- 增量修改，提交前跑：
  ```bash
  ruff check .
  pytest tests/ -q
  ```

### 5. 提交 & 推送
```bash
git add -A
git commit -m "type(scope): 简短描述"
git push origin <branch-name>
```

### 6. 提 Pull Request
- 用 [PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md) 填写
- 关联相关 Issue（`Closes #123` / `Refs #456`）
- 等 CI 全绿后等待 Review

## 代码风格

- **Python**：遵循 PEP 8 + 类型注解；使用 `ruff`（`ruff check .` / `ruff format .`）
- **注释/文档**：中文为主；代码标识符用英文
- **提交粒度**：一个 commit 只做一件事
- **新增文件**：
  - 示例代码放 `examples/`，命名沿用 `NN_xxx.py` 形式
  - 文档放 `docs/`，沿用章节前缀
  - 测试放 `tests/`，文件名以 `test_` 开头

## 提交规范

本项目采用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

常用类型：
- `feat`：新功能
- `fix`：Bug 修复
- `docs`：仅文档变更
- `refactor`：既不修 bug 也不加功能的代码变更
- `test`：仅测试变更
- `chore`：杂项（构建、CI、依赖等）

示例：
```
feat(examples): 增加 Ollama 本地模型示例
fix(04_rag): 修复向量库路径在 Windows 下的兼容问题
docs(readme): 补充 Ollama 部署说明
```

## Pull Request 检查清单

提交 PR 前请确认：

- [ ] 代码已通过 `ruff check .`
- [ ] 测试已通过 `pytest tests/ -q`
- [ ] 新增功能附带了对应的 `examples/` 或 `notebooks/`
- [ ] 文档/注释已同步更新
- [ ] 提交信息遵循 Conventional Commits
- [ ] PR 描述说明：动机、改动、影响、截图（如有）

---

再次感谢你的贡献！💖
