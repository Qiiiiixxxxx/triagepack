# Launch kit

The goal is real users and useful feedback—not artificial stars. Publish only after enabling private vulnerability reporting and shipping the npm package.

## Repository setup

- Description: `Safe, redacted diagnostics for actionable GitHub issues.`
- Website: npm package URL after publishing
- Topics: `bug-report`, `cli`, `diagnostics`, `github-issues`, `maintainers`, `nodejs`, `open-source`, `redaction`, `support-bundle`, `triage`
- Social preview: `assets/social-preview.png`
- Enable Issues, Discussions, private vulnerability reporting, and branch protection.

## First release

1. Configure npm trusted publishing for `.github/workflows/release.yml`, then publish `0.1.0` with provenance. If using a token instead, add `NODE_AUTH_TOKEN` to the publish step and store it as an Actions secret.
2. Create GitHub release `v0.1.0` from the changelog.
3. Pin a Discussion asking maintainers which diagnostic command they repeatedly request.
4. Create roadmap issues with `good first issue` and `help wanted` labels only where the work is genuinely scoped.

## Four-week evidence plan

Track evidence the official application actually asks for: usage, ecosystem value, and active maintenance.

| Week | Ship | Community work | Evidence |
| --- | --- | --- | --- |
| 1 | npm release, demo GIF, two example recipes | Show HN, r/opensource, relevant CLI communities | installs, feedback links |
| 2 | JSON Schema and one requested recipe | answer every issue, invite a design partner | external repo adoption |
| 3 | report validation Action | write a technical post on safe diagnostic collection | PRs, issue response time |
| 4 | release from user feedback | publish case study with time saved | releases, dependents, contributors |

Avoid mass unsolicited promotion. Share a working demo, explain the problem, ask a specific question, and disclose that you maintain the project.

## Launch post

**Title:** TriagePack: turn “it broke” into a safe, actionable GitHub issue

Open-source maintainers spend too much time asking for versions, environment details, health-check output, and reproduction steps. I built TriagePack, a zero-dependency CLI that lets a repo define a small diagnostic recipe. Contributors run one command and get a local Markdown report with common secrets and home paths redacted.

It never invokes a shell, previews every command before execution, uploads nothing, and gives contributors the final review before sharing. I would especially value feedback on the threat model and which project diagnostics you ask users for most often.

## Application timing

Apply after the repository shows ongoing maintenance and meaningful use. Star count can be mentioned, but it should not be the main argument. Stronger evidence includes public releases, npm downloads, repositories adopting the config, resolved issues, reviewed PRs, and a concrete maintainer automation plan.
