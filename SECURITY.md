# Security policy

## Supported versions

Until version 1.0, only the latest release receives security updates.

## Reporting a vulnerability

Do not open a public issue for a secret-redaction bypass or command-execution vulnerability. Use GitHub private vulnerability reporting in the repository's Security tab. Include a minimal reproduction and avoid real credentials.

We aim to acknowledge reports within 72 hours and provide a status update within seven days.

## Important limitation

Redaction is defense in depth, not a guarantee. Always review generated reports before publishing them. If a secret was exposed, revoke or rotate it immediately.

Diagnostic programs receive a minimal allowlist of environment variables needed for process discovery and temporary files. API keys, access tokens, and unrelated application configuration are not inherited by default.

`triagepack.config.json` is trusted executable configuration. Direct process spawning and shell blocking reduce parsing ambiguity but do not sandbox the selected executable. Inspect configuration changes, run only trusted repositories, and reserve `--yes` for reviewed commits.
