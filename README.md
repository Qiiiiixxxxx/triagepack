# TriagePack

**Turn “it broke” into a safe, actionable GitHub issue.**

TriagePack is a zero-dependency CLI that lets open-source maintainers define a small diagnostic recipe. Contributors run one command and get a structured Markdown report with environment details, reproduction steps, command output, and automatic secret redaction.

```text
$ npx triagepack collect
This trusted configuration requests the following commands:
  • node --version
  • git --version
Continue? [y/N] y
Wrote redacted report to triagepack-report.md
```

No account. No telemetry. No upload. The report stays on the contributor's machine until they review and share it.

## Why TriagePack

Maintainers repeatedly ask the same questions: Which version? Which OS? Does the health check pass? What are the exact reproduction steps? Generic issue forms cannot safely run project-specific diagnostics, while ad-hoc “support bundle” scripts are difficult to audit and often leak credentials.

TriagePack makes the collection contract visible and version-controlled:

- **Smaller attack surface:** uses direct process execution, never a shell; blocks common shell interpreters.
- **Review before run:** prints every command and requires approval.
- **Private by default:** redacts common tokens, credentials, private keys, URLs, and home paths locally.
- **Reduced exposure:** diagnostic processes receive a minimal environment instead of inheriting API keys and tokens.
- **Maintainer-owned:** a small JSON file defines prompts and diagnostic commands.
- **Portable:** one zero-dependency Node.js package for macOS, Linux, and Windows.
- **Automation-ready:** deterministic Markdown/JSON output plus a CI-friendly `check` command.

## Quick start

### For maintainers

```bash
npx triagepack init
```

Edit `triagepack.config.json`, commit it, and add this sentence to your bug template:

> Run `npx triagepack collect`, review `triagepack-report.md`, then attach or paste it here.

Example configuration:

```json
{
  "schemaVersion": 1,
  "project": "Acme CLI",
  "issueUrl": "https://github.com/acme/cli/issues/new",
  "prompts": [
    { "id": "summary", "label": "What happened?", "required": true },
    { "id": "steps", "label": "Steps to reproduce", "required": true }
  ],
  "commands": [
    { "name": "Acme health", "command": "acme", "args": ["doctor", "--plain"], "timeoutMs": 10000 },
    { "name": "Node.js", "command": "node", "args": ["--version"], "timeoutMs": 5000 }
  ]
}
```

### For contributors

```bash
npx triagepack collect
```

Read the command preview, approve it, answer the reproduction questions, and review `triagepack-report.md` before sharing. A repository configuration is executable by design: only run it from a project you trust.

## Commands

| Command | Purpose |
| --- | --- |
| `triagepack init` | Create a documented starter configuration |
| `triagepack collect` | Ask questions, run approved diagnostics, write Markdown |
| `triagepack collect --json` | Produce machine-readable output |
| `triagepack redact [file]` | Redact a file or piped text |
| `triagepack check [report]` | Validate configuration or scan a report for secrets |
| `triagepack doctor` | Check the local runtime |

Use `--yes` only after reviewing the committed configuration. It is intended for CI and other non-interactive environments.

## Threat model

TriagePack reduces accidental disclosure; it cannot prove that arbitrary diagnostic output is safe. Maintainers should request the minimum useful data, contributors must review reports, and secrets should be rotated if they were exposed anywhere.

The configuration is trusted input, not a sandbox. Any executable can perform side effects even without a shell (for example, a language runtime can evaluate code passed as an argument). Review configuration changes like source code and never use `--yes` on an untrusted checkout.

The CLI does not:

- invoke a system shell or accept shell syntax;
- upload reports or send analytics;
- read arbitrary files from the repository;
- include the complete process environment;
- claim perfect secret detection.

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities and [docs/configuration.md](docs/configuration.md) for the full configuration contract.

## Roadmap

- GitHub Action that validates attached reports
- optional project-specific redaction expressions with safety limits
- adapters for popular package managers and frameworks
- machine-readable JSON Schema
- opt-in OpenAI-powered duplicate detection and maintainer summaries, with untrusted-content boundaries

## Contributing

Small, test-backed pull requests are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md), or open an issue describing the maintainer workflow you want to improve.

MIT © TriagePack contributors
