# Security Policy

> 🌐 **中文版**: [SECURITY.md](SECURITY.md)
>
> 🧭 **Navigate** · [🏠 Project Home](README.en.md) · [Contributing](CONTRIBUTING.en.md)
>
> 🏷️ **Type**: Security policy · **For**: vulnerability reporters

## Supported Versions

The following table shows which versions of this project receive security updates:

| Version | Supported |
| --- | --- |
| `main` branch | ✅ Receives security updates |
| `v0.3.x` | ✅ Receives security updates |
| `v0.2.x` | ✅ Receives security updates |
| `v0.1.x` | ⚠️ Critical issues only |
| `< v0.1.0` | ❌ Unsupported |

## Reporting a Vulnerability

**Do not report security vulnerabilities in public Issues.** Describing the vulnerability in a public issue could allow others to exploit it before a patch is published.

Please report privately through:

1. **GitHub private report**: [Security Advisories](../../security/advisories/new) (recommended)
2. **Email**: contact the repo owner (see [README.md](README.md))

When reporting, please provide as much of the following as possible:

- Vulnerability type and impact
- Affected file / function / endpoint
- Reproduction steps (PoC)
- Known mitigations

We commit to acknowledging within **48 hours** of receipt and providing a fix plan within **7 business days**.

## Known Security Considerations

This project is a **learning project**; the following risk points need special attention:

| Risk | Location | Mitigation |
| --- | --- | --- |
| `eval` executing arbitrary code | `examples/_common/_safe_eval` already uses an AST whitelist; `05_agents.py` no longer uses `eval` |
| Third-party OpenAI-compatible endpoint | When `.env`'s `OPENAI_API_BASE` points to a third party, confirm it's trusted; non-official endpoints like `aiping.cn` don't guarantee data security |
| Key leakage | `.env` is in `.gitignore`; if you ever committed it by mistake, **rotate** the key on the corresponding platform immediately and clean history with `git filter-repo` |
| Prompt injection | This project is for local learning, no prompt-injection protection is implemented; before going to production, add input validation and human review |

## Security Release Process

- Fixes are merged to `main` and tagged with a patch version (e.g. `v0.3.1`).
- Marked as `[Security]` in [GitHub Releases](../../releases) and [CHANGELOG.md](CHANGELOG.md).
- Critical vulnerabilities are notified via [GitHub Security Advisory](../../security/advisories) before a patch is released.
