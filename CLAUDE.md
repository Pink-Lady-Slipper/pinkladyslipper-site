# Pink Lady Slipper Website

## MCP restrictions

NOTHING in this project reads from or writes to ClaudeHub. Do not use the
`claude-hub` MCP server (or any of its tools — `kb_list`, `kb_read`,
`kb_record`, `kb_search`, `list_projects`, `scan_projects`, `server_status`,
`start_server`, `stop_server`, `tail_logs`) for anything in this project.
Treat it as fully disabled here, even if it appears in the available tools
list.

## Environments

This project has its own three-stage environment model, separate from every
other project on this machine (shankfiddle, sanskrit-veda-app, ClaudeHub,
etc. are unrelated — do not cross-reference or reuse credentials between
them):

| Name | What it is | Repo | Hosting |
|---|---|---|---|
| **DEV** | Working environment (this checkout) | `shankardba/pinkladyslipper` (`origin` remote) | GitHub Pages: https://shankardba.github.io/pinkladyslipper/ |
| **ACPT** | Acceptance/staging, owned by Eric (the band's guitarist) | `Pink-Lady-Slipper/pinkladyslipper-site` (`acpt` remote) | GitHub Pages: https://pink-lady-slipper.github.io/pinkladyslipper-site/ |
| **PROD** | Production — the public live site | Same repo as ACPT (`Pink-Lady-Slipper/pinkladyslipper-site`) | Cloudflare Workers (static assets), auto-deployed on every push to `main`: https://pinkladyslipper.net (also reachable at https://pinkladyslipper-site.baseball4537.workers.dev) |

### PROD is auto-deployed from ACPT — there is no separate promotion step

Unlike DEV → ACPT, **ACPT → PROD has no manual gate**. Cloudflare's Git
integration (Workers & Pages project `pinkladyslipper-site`, connected as the
`Pink-Lady-Slipper` GitHub account) rebuilds and deploys automatically on
every push to `acpt`'s `main` branch — no build command, static assets served
directly (Cloudflare auto-generated the Worker/assets config; there is no
`wrangler.toml` committed in this repo). In effect, **ACPT *is* production**:
anything pushed there is live on https://pinkladyslipper.net within moments.

This means the only intentional checkpoint left in the whole pipeline is
**DEV → ACPT** (`git push acpt main`, manual/on request as below). Once
something is promoted to ACPT, it is public. Treat "promote to ACPT" as the
real go-live decision from here on.

### Access to ACPT (Pink-Lady-Slipper account)

- **Git push access**: SSH deploy key at `~/.ssh/id_ed25519_pls_acpt`, configured
  via the `github-pls` host alias in `~/.ssh/config`. This key is scoped to
  *only* the `pinkladyslipper-site` repo (added as a repo Deploy Key with
  write access) — it cannot access any other repo on that account.
- **API/admin access**: a full `gh` CLI login for the Pink-Lady-Slipper
  account, isolated in its own config directory so it never touches or
  overrides the default `gh` identity (shankardba) used everywhere else.
  Always prefix commands with `GH_CONFIG_DIR=~/.config/gh-pls-acpt`, e.g.:
  ```
  GH_CONFIG_DIR=~/.config/gh-pls-acpt gh api repos/Pink-Lady-Slipper/pinkladyslipper-site/pages
  ```
  Never run a bare `gh auth switch` to make Pink-Lady-Slipper the default
  account — this project's access must stay opt-in per command.

### Promotion flow

Promotion from DEV to ACPT is **manual only, on explicit request** — never
auto-push to the `acpt` remote as a side effect of a DEV commit/push. When
asked to promote: `git push acpt main`.

PROD/Cloudflare is out of scope until explicitly picked up later.
