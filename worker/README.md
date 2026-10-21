# Mailing-list Worker

A standalone Cloudflare Worker that stores signups in Workers KV. There's no Google and no email provider: the band copies the list from the admin page and sends from Gmail with BCC. This folder is kept out of the site's PROD assets by `/.assetsignore`.

## Endpoints (under `/api/list`)

| Method + path | Body | Response |
|---|---|---|
| `POST /subscribe` | JSON `{email, name?, company, source?, turnstileToken?}` | `{ok:true}`. Also returned for an existing subscriber, and for a filled-in `company` honeypot, which is silently dropped. Returns `400 {error}` for a bad email or a failed Turnstile check. |
| `POST /unsubscribe` | JSON `{email}` | Always `{ok:true}` for a valid email, so it never reveals who is on the list. |
| `GET /admin` | none (HTTP Basic Auth, any username, password = `ADMIN_PASSWORD`) | Admin page with the subscriber count, a copy-for-Gmail-BCC button, a CSV download and a Remove button per row. |
| `GET /admin/export.csv` | none (same auth) | CSV with `email,name,subscribed_at,source`. |
| `POST /admin/remove` | form `email` (same auth) | Redirects back to the admin page. Rejected with 403 unless the `Origin` header equals the Worker's own origin, because browsers resend Basic Auth on cross-site posts. |

The public endpoints only answer browsers from `ALLOWED_ORIGINS`, which is also used as the CORS list. Turnstile is checked only when the `TURNSTILE_SECRET` secret is set.

Each subscriber is stored as KV key `sub:<lowercased email>` with an empty value and metadata `{email, name, source, subscribed_at}`. The admin page needs only one `KV.list()` pass. KV listings can lag writes by up to a minute, so the admin page hides an address it has just removed.

## Deploy

All PLS resources live on the band's Cloudflare account.

```
export CLOUDFLARE_API_TOKEN=$(cat ~/.config/cloudflare-pls-prod/token)
export CLOUDFLARE_ACCOUNT_ID=feaccfb4bfda7d10bd645e2d95928d51
npx wrangler deploy --config wrangler.test.toml
npx wrangler secret put ADMIN_PASSWORD --config wrangler.test.toml
```

The test admin password is in `~/.config/pls-mailing-list/admin-password-test`. Never run `wrangler deploy` from the repo root, because PROD's Cloudflare build runs there.
