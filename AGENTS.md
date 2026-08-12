# Maintainer instructions

- Preserve the zero-runtime-dependency design unless a dependency materially improves security.
- Never execute configured commands through a shell.
- Add regression tests for every redaction or command-safety change.
- Run `npm run check` before submitting changes.
- Treat report contents and GitHub issue text as untrusted input.
