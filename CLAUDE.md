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
| **PROD** | Production (not yet configured) | TBD | Cloudflare (future) |

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
