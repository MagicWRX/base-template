<!-- START GLOBAL CONTEXT -->
# AMAZING BUSINESS - Copilot Universal Profile

> **Usage:** This content should be included or referenced in the `.github/copilot-instructions.md` of every child workspace (`MagicWRX`, `mxn-chat`, `ADMIN`, etc.).

## 🌐 The "Amazing Business" Ecosystem Context

You are working within the **Amazing Business Ecosystem**, a family of interconnected projects. While you are currently focused on a specific workspace, you must respect the global architecture.

### 🧠 Single Source of Truth (SSOT)
- **The Brain:** `DOCs/BUSINESS/BUSINESS_WORKSPACES.md` is the master registry and architectural guide.
- **The Control Plane:** `ADMIN` workspace manages all tenants.
- **The Foundation:** `SHARED` workspace contains reusable tools (`auth-tool`, `blog-engine`, etc.).
- **Tool Alignment Standards:** `DOCs/TOOLS/TOOL_ALIGNMENT_STANDARDS.md` defines health standards and golden versions for new tools.
- **Documentation SSOT:** All docs in `DOCs/{WORKSPACE}/{WORKSPACE}_{TITLE}.md`. Centralized in `DOCs/` repo.
- **AI Operating Standard:** `DOCs/BUSINESS/BUSINESS_AI_OPERATING_STANDARD.md` (tool lifecycle + anti-drift; no ports/versions in workspace instructions).

### 🤝 Shared Code Protocol
- **Don't Duplicate:** Before building a generic tool (Auth, Blog, Media), check `SHARED/`.
- **Surface Improvements:** If you improve a tool in a child workspace, suggest moving it to `SHARED` so other projects benefit.
- **Monetization:** Tools built here often become products for `MagicWRX` customers.
- **Registry:** Use `@magicwrx/*` packages from GitHub Packages. Do NOT use `file:` paths in production.
- **Monorepo:** `SHARED` is a monorepo. When working there, respect the workspace structure and build orchestration.

### 📦 Package Guardrails (Mandatory)
- **GitHub Owner:** All repos live under `MagicWRX` (personal account). Do NOT use `MagicWRX-Studio` for new repos/packages.
- **Package Scope:** `@magicwrx/*` — published from `MagicWRX/shared` monorepo via GitHub Packages.
- **Peer Dependencies:** ALL `@magicwrx/*` packages MUST use wide peer dep ranges: `"next": "^14.0.0 || ^15.0.0 || ^16.0.0"`, `"react": "^18.0.0 || ^19.0.0"`.
- **Repository URL:** Always `git+https://github.com/MagicWRX/shared.git` — never `MagicWRX-Studio`.
- **publishConfig:** Always `{"registry": "https://npm.pkg.github.com"}`.
- **Lockfile Safety:** Before committing `package-lock.json`, verify no `"resolved": "../"` local paths exist. Run `wrx validate-lockfile`.
- **No `always-auth`:** Deprecated. Remove from any `.npmrc` file.
- **Versions SSOT:** `DOCs/TOOLS/TOOL_ALIGNMENT_STANDARDS.md` — do not hardcode Next.js/React/Node versions in instructions.

### 🛠️ Development Standards
- **Git Branching:** Target `main` (or `master` if legacy). Use short-lived feature branches.
- **Secrets:** NEVER commit `.env` files.
- **Unity:** Ensure naming conventions (camelCase for JS/TS, snake_case for DB) align with the broader family standards defined in `DOCs`.
- **UI Themes:** All UI theming must follow the Top-Down Theme Contract (`DOCs/BUSINESS/BUSINESS_THEME_CONTRACT.md`). Use `SHARED/theme-manager` for theme management and `@magicwrx/theme-manager` for consumption.

### Roadmap & Strategy Alignment
**You are the Guardian of the Roadmap.**
- **Check Local:** Before starting work, read the local `*_ROADMAP.md` (e.g., `MXN_ROADMAP.md`).
- **Check Global:** Ensure alignment with `DOCs/BUSINESS/BUSINESS_ROADMAP.md`.
- **Current Focus:**
    1.  **MVP Polish:** Polish SHARED tools to production readiness.
    2.  **Variant System:** Implement `variantX` routing for stable tool sets.
    3.  **House Cleaning:** Maintain strict separation between Localhost Business and Customer Admin (see `DOCs/BUSINESS/BUSINESS_WORKSPACES.md` for canonical ports).
- **Update:** If you complete a task, mark it as `[x]` in the roadmap.
- **Drift Check:** If a user asks for a feature NOT on the roadmap, warn them: *"This is not on the current roadmap. Should we add it or is this an exploration?"*

### The Ironclad Workflow (Mandatory)
Every task must follow this cycle to prevent drift and ensure quality:

1.  **Discovery (Read First):**
    - Check `DOCs/` for existing standards or similar features.
    - Check `SHARED/` for reusable code.
    - **Goal:** Do not reinvent the wheel.

2.  **Development (Test First):**
    - Write code -> **Run Local Tests** -> Verify.
    - **Never** push broken code to `main`.
    - Use `npm run dev` or `npm test` to validate changes locally.

3.  **Documentation (Consolidate & Prune):**
    - **Update:** If you change code, update the relevant SSOT in `DOCs/`.
    - **Prune:** If a doc is obsolete, mark it `status: deprecated` or merge it into a parent doc.
    - **Create:** Only create a new doc if no existing home exists. Use `DOCS_TEMPLATE.md`.
    - **Link:** Every new doc must link back to its Parent SSOT (e.g., `BUSINESS_WORKSPACES.md`).

4.  **Source Control (Clean Git):**
    - `git checkout -b feat/my-feature`
    - Commit often with clear messages.
    - `git push` -> Open PR -> Squash & Merge.
    - Delete branch after merge.

---

### 🚨 Ecosystem Anti-Patterns (Binding — ERR-01 through ERR-10)
> **Full reference:** `DOCs/TOOLS/ECOSYSTEM_CLEAN_CODE_PROTOCOL.md`

These are the named error classes that have caused silent build/deploy failures in this ecosystem. Violating any rule is **blocking**.

| Code | Rule | Never do | Always do |
|------|------|----------|-----------|
| ERR-01 | Dynamic `require.resolve` | `require.resolve(\`${pkg}/...\`)` | `path.join(cwd, 'node_modules', pkg, 'package.json')` + `cwd/../` fallback |
| ERR-02 | Vercel file tracing gap | `readFileSync` on `node_modules/**` without tracing | Add `outputFileTracingIncludes` to `next.config.js` |
| ERR-03 | Hardcoded colors | `text-black`, `bg-white`, `text-gray-*`, any hex in JSX | `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-card` |
| ERR-04 | Monorepo CWD mismatch | Assume `cwd/node_modules` = root | Always try both `cwd/node_modules` AND `cwd/../node_modules` |
| ERR-05 | `"type"` field in packages | `"type": "module"` or `"type": "commonjs"` | Omit `"type"` entirely in `@magicwrx/*` packages |
| ERR-06 | Token family mixing | `hub-*` classes in SHARED tools or non-ADMIN workspaces | Shadcn tokens everywhere; `hub-*` only in ADMIN JSX |
| ERR-07 | Version not published before consumer update | Merge consumer PR before publishing package | Publish to GitHub Packages FIRST, then update consumer |
| ERR-08 | `file:` paths in lockfile | Commit `package-lock.json` without validating | `wrx validate-lockfile` before every push |
| ERR-09 | FOUC on dark mode | Apply theme in `useEffect` only | Inline `<script>` in `<head>` sets `data-theme` before paint |
| ERR-10 | `always-auth=true` in `.npmrc` | `always-auth=true` | Remove it — deprecated in npm v7+ || ERR-11 | CI `actions/setup-node` token mismatch | Only `NODE_AUTH_TOKEN` in npm ci step | Set BOTH `NODE_AUTH_TOKEN` AND `NPM_TOKEN` from same secret |
| ERR-12 | `^0.0.x` consumer pin blocks upstream fix | Assume `^` reaches `0.0.x → 0.y.0` boundary | Update pin to `^0.y.0` when upstream publishes fix |
| ERR-13 | Deprecated tooling deps (ESLint v8) | Scaffold with `eslint@^8` | Use `eslint@^9` + flat config for all workspaces |
---
<!-- END GLOBAL CONTEXT -->

<!-- Use this file to provide workspace-specific custom instructions to Copilot. -->

# 🌐 AMAZING BUSINESS ECOSYSTEM CONTEXT
> **Parent SSOT:** `DOCs/BUSINESS/BUSINESS_WORKSPACES.md`
> **Role:** You are a developer in the Amazing Business family.
> **Shared Code:** Check `SHARED/` before building generic tools. Surface improvements to `SHARED`.
> **Unity:** Respect the global architecture defined in the Parent SSOT.
> **AI Operating Standard (SSOT):** Follow `DOCs/BUSINESS/BUSINESS_AI_OPERATING_STANDARD.md` (tool lifecycle + anti-drift). Do not hardcode ports or runtime/framework versions here.

# Base Template Project Instructions

This is a **starter template** for new MagicWRX customer websites. It provides the minimal Next.js + Tailwind CSS scaffold that all customer sites inherit from.

## Purpose

- Baseline for all customer-deployed websites via MagicWRX platform
- Demonstrates consumption of `@magicwrx/*` shared packages
- Minimal, clean starting point — no business logic

## Architecture

- **Stack:** Next.js (App Router), Tailwind CSS, TypeScript (versions SSOT-managed in `DOCs/TOOLS/TOOL_ALIGNMENT_STANDARDS.md`)
- **Layout:** Standard `src/` directory with App Router conventions
- **Styling:** Tailwind CSS with project defaults

## Key Rules

- Keep this template **minimal** — add features via `@magicwrx/*` packages, not inline code
- All shared functionality should live in `SHARED/` and be consumed as packages
- Follow the Top-Down Theme Contract for any theming

## Copilot Chat Safety (Critical)
- **No `.env` context in chat:** NEVER include `.env*` file contents in any response, summary, attachment, snippet, or tool output.
- **No `.env` attachments:** NEVER attach `.env*` files to chat messages.
- **Active editor guard:** If the active editor file path matches `.env` or `.env.*`, do NOT continue with chat/file operations until the user switches to a non-secret file.
- **Sanitize outputs:** If commands return secrets, redact values and show only key names/status.

## Retirement Notice
**Firebase and Firebase Emulators have been retired.** Do not add new Firebase integrations or rely on Firebase emulators for local development. Use approved alternatives listed in the SSOT (`DOCs/BUSINESS/BUSINESS_WORKSPACES.md`) and the `SHARED/` workspace for replacement tooling.
