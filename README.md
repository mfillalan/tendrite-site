# Tendrite website

Static marketing site and Pro product overview for Tendrite, a local-first desktop coding workspace for teams of AI agents.

## Run locally

```bash
python -m http.server 8080
```

Open `http://127.0.0.1:8080/` for the product page or `http://127.0.0.1:8080/pro/` for the Pro page.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Tendrite product overview and free workspace page |
| `pro/index.html` | Pro benefits, plan comparison, availability status, and FAQ |
| `styles.css` | Shared responsive visual system |
| `script.js` | Mobile navigation, footer year, download links, and image lightbox |
| `config.js` | Public environment and product configuration |

## Pro payment status

Pro checkout is intentionally disabled while payment processing is prepared for launch. The site contains no Paddle configuration or checkout code, so visitors cannot open a sandbox or live payment flow.

### Milestone — 2026-07-26

Disabled the sandbox Pro checkout until live payment processing is ready.

Added the Memory Substrate feature story and product capture, explaining agent-led capture, ranked recall, and reversible consolidation.

## Downloads

The first public Windows tester installer is configured in `config.js` and hosted at `https://downloads.tendrite.dev/Tendrite-win-Setup.exe`. Linux remains disabled until its release artifact is ready. Keep download URLs public only; do not add R2 credentials or other private tokens to this repository.

## Deployment

The site has no build step. It can be deployed from the repository root to Cloudflare Pages, GitHub Pages, or another static host. The `/pro/` directory provides the `/pro/` route for static hosting.
