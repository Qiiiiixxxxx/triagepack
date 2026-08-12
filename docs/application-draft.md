# Codex for Open Source application draft

Replace bracketed values with verified facts. Each answer stays below the form's 500-character limit.

## Role

I am the primary maintainer of TriagePack. I designed its security model, maintain the CLI and redaction engine, review contributions, triage issues, publish releases, and support adopters across macOS, Linux, and Windows.

## Why this repository qualifies

TriagePack reduces repeated issue-triage work for open-source maintainers by turning incomplete bug reports into structured, locally generated diagnostics. It has [STARS] stars, [MONTHLY DOWNLOADS] monthly npm downloads, and is used by [ADOPTING REPOS] repositories. The project is actively maintained through cross-platform releases, issue triage, security fixes, and contributor PR review.

## How API credits will be used

Credits will support an opt-in maintainer workflow that summarizes redacted reports, suggests duplicate issues, and drafts reproduction checklists. Untrusted issue content will be isolated from tool instructions; outputs will be advisory and require maintainer approval. The core collector will remain local, deterministic, telemetry-free, and fully usable without an API key.

## Anything else

TriagePack is deliberately zero-dependency and privacy-first: it never invokes a shell, previews configured commands, gives diagnostic processes a minimal environment, uploads nothing, and asks users to review every report. Support from Codex would help maintain cross-platform tests, review security-sensitive PRs, triage adopter feedback, and ship safer releases faster.
