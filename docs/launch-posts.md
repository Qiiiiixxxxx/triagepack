# Launch posts

Use these drafts as starting points. Answer comments as the maintainer, disclose that you built the project, and adapt the opening sentence to each community instead of cross-posting identical copy.

## Assets

1. `assets/demo.gif` — primary demo for GitHub, Show HN, DEV, and article embeds.
2. `assets/demo-review.png` — command-review safety boundary.
3. `assets/demo-result.png` — redaction result.
4. `assets/social-preview.png` — link preview and article cover.

## Chinese long post

### Suggested title

我做了一个开源 CLI，把“跑不起来”变成可排查、经过脱敏的 GitHub Issue

### Body

维护开源项目时，我经常看到信息不足的 Bug 报告：只有一句“跑不起来”，却没有版本、系统环境、复现步骤或诊断输出。维护者只能重复追问，贡献者也不知道哪些信息安全、哪些不该公开。

所以我做了 TriagePack。维护者在仓库里提交一个很小的 `triagepack.config.json`，声明需要询问的问题，以及允许执行的诊断程序和参数。贡献者运行：

```bash
npx triagepack collect
```

CLI 会先列出准备执行的命令，获得确认后再收集信息，最终在本地生成 Markdown 或 JSON 报告。常见 API Key、GitHub Token、JWT、私钥、数据库连接地址和本机用户目录会在写入报告前脱敏。

我刻意保留了几个边界：零运行时依赖、不上传数据、不读取完整环境变量、不通过 Shell 执行命令。配置文件仍然属于受信任的可执行配置，而不是安全沙箱；用户必须审查配置和最终报告。

目前 `0.1.0` 已发布，支持 Windows、macOS 和 Linux，CI 覆盖 Node.js 20、22、24。

- GitHub: https://github.com/Qiiiiixxxxx/triagepack
- npm: https://www.npmjs.com/package/triagepack
- 反馈讨论: https://github.com/Qiiiiixxxxx/triagepack/discussions/4

我最想听维护者回答一个具体问题：你在处理 Bug 时，最常要求用户补充哪一条诊断信息？

## Chinese short post

我开源了 TriagePack：维护者在仓库里声明诊断问题和只读命令，用户运行 `npx triagepack collect`，即可在本地生成经过常见密钥与路径脱敏的 GitHub Issue 报告。

零运行时依赖、不上传数据、不走 Shell；配置和报告仍需人工审查。想请教维护者：你最常要求 Bug 提交者补充什么信息？

https://github.com/Qiiiiixxxxx/triagepack

## English long post

### Suggested title

TriagePack: turn “it broke” into a local, redacted, actionable GitHub issue

### Body

Maintainers repeatedly ask the same follow-up questions: Which version? Which OS? What are the exact reproduction steps? Does the project's health check pass? Contributors often do not know what is useful—or what is unsafe to paste into a public issue.

I built TriagePack, a zero-runtime-dependency CLI that lets a repository commit a small diagnostic recipe. A contributor runs:

```bash
npx triagepack collect
```

TriagePack previews every requested executable and argument, asks for approval, collects reproduction details, and writes a local Markdown or JSON report. Before writing, it redacts common API keys, GitHub tokens, JWTs, private keys, database URLs, credentials, and home-directory paths.

The security boundary is intentionally explicit: no shell invocation, no upload, no telemetry, and diagnostic processes receive a minimal environment. The configuration is still trusted executable input—not a sandbox—and users must review both the recipe and the final report.

Version `0.1.0` is available for Windows, macOS, and Linux, with CI across Node.js 20, 22, and 24.

- GitHub: https://github.com/Qiiiiixxxxx/triagepack
- npm: https://www.npmjs.com/package/triagepack
- Maintainer feedback thread: https://github.com/Qiiiiixxxxx/triagepack/discussions/4

The question I would most value feedback on: what diagnostic do you repeatedly ask bug reporters to provide?

## English short post

I built TriagePack: a zero-dependency CLI for turning incomplete bug reports into local, structured diagnostics with common secrets and home paths redacted.

It previews commands, never invokes a shell, uploads nothing, and makes its trust boundary explicit. What diagnostic do you repeatedly ask users for?

https://github.com/Qiiiiixxxxx/triagepack

## Platform notes

| Platform | Recommended draft | Adjustment |
| --- | --- | --- |
| V2EX | Chinese long | Lead with the maintainer problem; use the GIF and ask for technical criticism. |
| 掘金 / DEV | Long post | Add the threat model and one configuration example. |
| 知乎 / 小红书 | Chinese long/short | Use the two static screenshots before the link. |
| Show HN | English long | Title should start with `Show HN:` and avoid marketing claims. |
| r/opensource | English long | State that you are the maintainer and ask about adoption friction. |
| r/commandline | English long | Emphasize zero dependencies, cross-platform behavior, and CLI ergonomics. |

## Comment response checklist

- Thank people for concrete feedback, then ask one clarifying question.
- Open a public issue for reproducible defects and link back to it.
- Do not argue with security criticism; document the boundary or add a regression test.
- Never claim perfect secret detection.
- Do not ask for stars in replies. Ask whether the workflow would fit their repository.
