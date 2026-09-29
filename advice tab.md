PROJECT NAME: advice tab

META-INSTRUCTIONS:

<Read it all before acting. Ask about anything unclear, contradictory or
 underspecified — before starting and mid-build. Ask in the question widget
 (AskUserQuestion): related questions batched, concrete options, your
 recommendation first. Plain text only if the widget isn't available.>

<Don't expand scope. Anything not listed here is a proposal, including changes
 to this file — propose it, don't do it.>

<Prefer doing over describing: run the code, write the files, test it.>

<Always in scope, no proposal needed: when it goes on GitHub, a short README
 that leads with visuals (screenshots, a diagram or a chart) and a line on what
 it is, linking to docs/GUIDE.md for setup and usage; and a small unobtrusive
 feedback tab if what you're building is an application rather than a script.>

<If what you're building is an application, build it as a Mac app first; the
 website comes after, as its own step.>

<Name things the way a person would say them — "Goal Tracker", not
 goal_tracker — for the app, its windows, titles, files people open, repo
 descriptions and README headings. Where a name can't hold spaces (repo names,
 bundle IDs), use hyphens, never underscores.>

<Finish by listing every deliverable: path, what it is, how to check it works.>

<Git rules (no Claude attribution, never commit .claude/) are in
 ~/.claude/CLAUDE.md and apply on their own — nothing to repeat here.>

<Keep the changelog at the bottom current.>

CONTEXT:

a link in which folks can send reachouts/questions directly to your email.

OPEN QUESTIONS / ASSUMPTIONS:

<Agent fills in: what it guessed, what it decided without asking.>

Answered by the owner on 2026-09-29:
- Form: web page only, no Mac app. A link other people open can't be a Mac app, so the Mac-app-first rule doesn't apply here.
- Delivery: Web3Forms (free, no backend, owner's email never shown on the page).
- Hosting: GitHub Pages, repo `advice-tab`.
- Fields: name, email, type (Reach out / Question / Advice), message, plus a hidden spam honeypot.

Decided without asking:
- No separate feedback tab. The page is itself a message-to-owner form, so a second feedback tab would duplicate it.
- The heading defaults to "Advice Tab"; the owner can rename it and the intro line in `config.js`.
- The Web3Forms access key is left as a placeholder. Getting one means entering the owner's email on web3forms.com, which the owner has to do.
- The GitHub repo is not created or pushed yet. That's outward-facing and waits for the owner's go-ahead.

CHANGELOG:

- 2026-09-29 — created
- 2026-09-15 — added meta-instruction: built-out applications include a small feedback tab
- 2026-09-15 — added meta-instruction: no "Claude" attribution in commits, PRs, or branches
- 2026-09-16 — added meta-instruction: always include a README when adding to GitHub
- 2026-09-16 — changed meta-instruction: ask clarifying questions in the question widget
- 2026-09-17 — added meta-instructions: Claude never a contributor; never commit .claude/
- 2026-09-26 — compressed the meta-instructions and every field prompt; git rules moved to the global instruction file
- 2026-09-27 — added meta-instruction: applications are built as a Mac app first, then a website
- 2026-09-28 — folded inputs, instructions, constraints, deliverables and done criteria into one free-form CONTEXT
- 2026-09-28 — changed meta-instruction: a README on GitHub always includes a visual
- 2026-09-28 — added meta-instruction: name things like a person would, never snake_case
- 2026-09-28 — changed meta-instruction: README leads with visuals; instructions live in a linked guide
- 2026-09-29 — built v1: static contact page (Web3Forms), README with screenshots and diagram, docs/GUIDE.md; filled in OPEN QUESTIONS
