# calcnavi AGENTS

## Development Rules

This file is the canonical development ruleset for Codex work in this repository.
Keep the rules short, stable, and practical.

### Core Workflow

- `1 purpose = 1 worktree`
  - Split off a new worktree when the task changes or a separate issue appears.
- `1 purpose = 1 branch`
  - Use one branch per objective. Follow the `codex/<purpose>` naming convention.
- `1 purpose = 1 PR`
  - Keep each PR reviewable as a single intent. Do not mix unrelated fixes, refactors, articles, or UI work.
- Do not fold side work into the current change.
  - If another task is found, move it to a separate worktree, branch, and PR.

### Article Rules

- Keep article frontmatter complete: `title`, `description`, `publishedAt`, `updatedAt`, `category`, `sources`.
- Write articles for practical decision-making. Include a clear conclusion, decision criteria, and relevant internal links.
- Prefer primary sources, public standards, and manufacturer documentation. Always keep source URLs and accessed dates.
- Only add related tools or articles when they directly support the article's judgement or workflow.

### Tool Rules

- Keep calculation logic in `lib/` pure functions. Do not bury formulas or judgement rules in page-level UI code.
- Tool pages should use the standard structure: `buildMetadata()`, `Breadcrumbs`, `SoftwareApplication` JSON-LD, and related-article guidance.
- Results must preserve units, judgement context, and inputs, not just raw numbers.
- Changes should avoid breaking existing history, PDF/report output, and related-content flows unless the task explicitly requires it.

### UI Rules

- Reuse existing page structure and shared classes such as `container`, `page-title`, and `page-description` before adding new layout patterns.
- Keep SEO and site-wide metadata decisions centralized in `lib/seo.ts` and `lib/site.ts`.
- Reuse existing shared components for breadcrumbs, related links, and article/tool cards wherever possible.
- Treat UI changes as structure and navigation changes too, not only visual changes.
