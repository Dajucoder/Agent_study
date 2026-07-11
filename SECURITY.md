# 安全策略（Security Policy）

> 🌐 **English version**: [SECURITY.en.md](SECURITY.en.md)
>
> 🧭 **导航** · [🏠 项目首页](README.md) · [贡献指南](CONTRIBUTING.md)
>
> 🏷️ **类型**：安全策略 · **适合**：报告漏洞者

## 支持的版本

下表说明本项目哪些版本接收安全更新：

| 版本 | 支持状态 |
| --- | --- |
| `main` 分支 | ✅ 接收安全更新 |
| `v0.2.x` | ✅ 接收安全更新 |
| `v0.1.x` | ⚠️ 仅关键问题 |
| `< v0.1.0` | ❌ 不再支持 |

## 报告漏洞

**请勿在公开 Issue 中报告安全漏洞。** 在公开 Issue 中描述漏洞细节可能导致其他用户在补丁发布前利用该漏洞。

请通过以下方式私下报告：

1. **GitHub 私有报告**：[Security Advisories](../../security/advisories/new)（推荐）
2. **邮件**：联系仓库所有者（见 [README.md](README.md)）

报告时尽量提供：

- 漏洞类型与影响
- 受影响的文件 / 函数 / 端点
- 复现步骤（PoC）
- 已知缓解措施

我们承诺在收到报告后 **48 小时内** 确认，并在 **7 个工作日内** 给出修复计划。

## 已知安全注意事项

本项目是**学习项目**，以下风险点需特别留意：

| 风险 | 位置 | 缓解 |
| --- | --- | --- |
| `eval` 类执行任意代码 | `examples/_common.py::_safe_eval` 已替换为 AST 白名单；`05_agents.py` 不再使用 `eval` |
| 第三方 OpenAI 兼容端点 | `.env` 中的 `OPENAI_API_BASE` 指向第三方服务时，请确认其可信；`aiping.cn` 等非官方端点不保证数据安全 |
| 密钥泄露 | `.env` 已在 `.gitignore` 忽略；如曾误提交，请立即在对应平台**轮换**并使用 `git filter-repo` 清理历史 |
| 提示注入 | 本项目为本地学习，未实现提示注入防护；上线服务前请加入输入校验与人审环节 |

## 安全发布流程

- 修复会合并到 `main` 并打上 patch 版本号（如 `v0.2.1`）
- 在 [GitHub Releases](../../releases) 与 [CHANGELOG.md](CHANGELOG.md) 中标注 `[Security]`
- 关键漏洞会在补丁发布前通过 [GitHub Security Advisory](../../security/advisories) 通知
