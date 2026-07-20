# Tendrite website

Static marketing site and Pro purchase entry point for Tendrite, a local-first desktop coding workspace for teams of AI agents.

## Run locally

```bash
python -m http.server 8080
```

Open `http://127.0.0.1:8080/` for the product page or `http://127.0.0.1:8080/pro/` for the Pro page.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Tendrite product overview and free workspace page |
| `pro/index.html` | Pro benefits, plan comparison, purchase entry point, and FAQ |
| `styles.css` | Shared responsive visual system |
| `script.js` | Mobile navigation, footer year, and Paddle checkout states |
| `config.js` | Public environment and product configuration |

## Paddle Sandbox

`config.js` contains the existing Sandbox price ID and an intentionally empty client-side token. Add the Paddle **client-side token** from the Paddle dashboard to `clientToken` for local testing; do not add API keys, webhook secrets, or other private credentials to this repository.

To move to Live, change `environment` to `live`, replace `clientToken` with the Live client-side token, and replace `priceId` with the Live price ID created for the production Pro product. Do not reuse the Sandbox price ID in production.

## Downloads

The first public Windows tester installer is configured in `config.js` and hosted at `https://downloads.tendrite.dev/Tendrite-win-Setup.exe`. Linux remains disabled until its release artifact is ready. Keep download URLs public only; do not add R2 credentials or other private tokens to this repository.

## Deployment

The site has no build step. It can be deployed from the repository root to Cloudflare Pages, GitHub Pages, or another static host. The `/pro/` directory provides the `/pro/` route for static hosting.
