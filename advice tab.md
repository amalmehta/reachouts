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
- Name: "Reachouts" (was "Advice Tab"). Repo and link are `reachouts`. This spec file keeps its original name.
- Form: web page only, no Mac app. A link other people open can't be a Mac app, so the Mac-app-first rule doesn't apply here.
- Hosting: GitHub Pages, repo `reachouts`, on the custom domain reachouts.me (bought by the owner on Cloudflare; DNS at Cloudflare).
- Visitor fields: just email and message, plus a hidden spam honeypot. The owner asked for it to be extremely simple and friendly.
- Accounts: anyone signs in with an emailed link, picks a handle and gets `…/reachouts/?u=<handle>`. Messages go to their inbox with Reply-To set to the visitor.
- Backend: Supabase (sign-in, database, edge function) plus Resend (sending). This replaced the earlier Web3Forms version.
- Tested on a full local copy of the backend with a fake Resend before going live.
- Headline: owners can add an optional headline (up to 160 characters) shown under their name, and edit it later.
- Supabase project `reachouts` created in the owner's org (us-west-2, free). The DB password is in the macOS Keychain. The branded sign-in email is on now that sign-in emails go through Resend.
- Domain: reachouts.me, verified in Resend. Messages and sign-in emails come from hello@reachouts.me via Resend, so anyone can sign up. The Resend key was entered by the owner in their terminal and is stored only as a Supabase secret.

Decided without asking:
- Your inbox is the email you sign in with, so it's verified and can't be pointed at someone else's address. There's no separate "send to" email.
- Rate limits: 5 messages an hour per visitor email, 30 an hour per link.
- No separate feedback tab. The product is itself a message-to-owner form.
- Pages show "Sign-ups open very soon" until the real Supabase URL and key are in `config.js`.

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
- 2026-09-29 — pushed to GitHub with Pages on; simplified the form to email + message only
- 2026-09-29 — friendlier look and copy: warm colors, rounded shapes, "Hey there 👋" heading
- 2026-09-29 — added Make Your Own page so anyone can get their own Advice Tab link (no login)
- 2026-09-29 — renamed to Reachouts; replaced Web3Forms with sign-in accounts (Supabase + Resend) so anyone can get their own link
- 2026-09-29 — created and deployed the Supabase project; added an optional headline to each page
- 2026-09-29 — moved to reachouts.me
- 2026-09-29 — connected Resend on reachouts.me for messages and sign-in emails; sign-ups open to anyone
