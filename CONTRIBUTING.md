# Contributing

Thanks for helping make bug reports easier to act on.

1. Open an issue before a large change.
2. Keep the CLI zero-dependency unless there is a clear security or maintenance benefit.
3. Add tests for redaction, validation, and cross-platform behavior.
4. Run `npm run check` before opening a pull request.
5. Update user-facing documentation when behavior changes.

Security properties are part of the public API. Changes that execute commands, collect information, or alter redaction need tests and a short threat analysis in the pull request.

By participating, you agree to follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
