# Configuration

TriagePack reads `triagepack.config.json` from the current directory unless `--config` points elsewhere.

## Top-level fields

| Field | Required | Meaning |
| --- | --- | --- |
| `schemaVersion` | yes | Must be `1` |
| `project` | yes | Human-readable project name |
| `issueUrl` | no | Where contributors should file the report |
| `prompts` | yes | Questions used to collect reproduction details |
| `commands` | yes | Explicit executables and arguments to run |

Each prompt needs a unique `id` and a `label`. Set `required` to `true` when an interactive contributor must answer it.

Each command supports:

- `name`: heading shown in the report;
- `command`: executable name or path;
- `args`: argument array—never a shell string;
- `timeoutMs`: 100 to 60,000 milliseconds, default 10 seconds;
- `maxOutputBytes`: captured stdout and stderr limit, default 20 KB.

## Safe recipes

Prefer read-only diagnostic subcommands such as `doctor`, `version`, `info`, or `config list --redacted`. Never request entire environment dumps, credential stores, source files, database contents, or verbose HTTP traces.

TriagePack blocks common shell interpreters both during configuration validation and during execution. That defense is deliberate: allowing `bash -c` or `powershell -Command` would make a command preview misleading and expand the injection surface.

This is not a sandbox. A trusted configuration may name any non-blocked executable, and many runtimes can execute code through their arguments. Review configuration changes as carefully as build scripts. Do not run TriagePack from an untrusted fork, pull-request checkout, or downloaded archive.

## CI

Validate the committed recipe:

```bash
npx triagepack check
```

Generate deterministic, non-interactive diagnostics only after reviewing the config:

```bash
npx triagepack collect --yes --json --output triagepack-report.md
```
