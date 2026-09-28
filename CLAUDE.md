# CLAUDE.md

Guidance for Claude Code when working in this repo (personal blog, published to frank2679.github.io).

## Stack

This is an **Astro** project — not Hexo. Ignore any legacy Hexo instructions you find; the site is built with Astro (`astro.config.mjs`, `src/`). Preview changes with the local dev server (`npm run dev`) before pushing.

## Git Workflow

- Never commit directly to `main` unless explicitly told to — always create a feature branch and open a PR.
- When asked to "create a PR," open a new PR. Don't append commits to an existing open PR unless asked to.
- Before committing, run `git status` and exclude binary or generated files (audio, `*.db`, `*.sqlite`, build output, `dist/`, `node_modules/`) — add them to `.gitignore` instead.

## Deployment Constraints

- Targets must work on free tiers and on iOS Safari.
- Avoid the Fullscreen API (unsupported on iOS Safari), iframe PDF embeds on mobile (only render one page there), and paid Cloudflare features (e.g. public preview URLs require a paid plan).
- `main` is the sole trunk: GitHub's default branch, and `.github/workflows/deploy.yml` triggers on push to `main` (build + publish to `gh-pages`, plus a daily cron to resync the resume PDF from `resume-ng`). `.github/workflows/ci.yml` runs a build-only check on every PR into `main`. (As of 2026-09-29: previously `deploy.yml` watched a stale `master` branch while GitHub's default branch had already been switched to `main`, so merges silently stopped deploying — reconciled by merging master's history into main and repointing deploy.yml. `master` is no longer used; don't target it.)
