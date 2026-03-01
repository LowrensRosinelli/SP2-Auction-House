# SP2 Auction House (Vanilla JS + Tailwind)

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Add your Noroff API key in terminal before running dev/build:
   ```bash
   export NOROFF_API_KEY="PASTE_REAL_KEY_HERE"
   ```
3. Start Tailwind watch mode while developing:
   ```bash
   npm run dev
   ```
4. Build production CSS:
   ```bash
   npm run build
   ```

`src/styles.css` is the Tailwind input, and `dist/styles.css` is generated output used by all HTML pages.

## API key setup
Do not commit a real API key.

- `npm run dev` and `npm run build` generate `js/runtime-config.js`.
- The file reads `NOROFF_API_KEY` from environment and sets `window.__NOROFF_API_KEY__`.
- If no key is set, a placeholder is written and protected endpoints will fail with API key error.

For Netlify:
1. Go to `Site settings -> Environment variables`.
2. Add `NOROFF_API_KEY` with your real value.
3. Deploy again (build runs `npm run build`, which injects the key into `js/runtime-config.js`).

`X-Noroff-API-Key` is sent on:
- login/register requests
- all requests where `auth: true` is used (profile, create/update/delete listing, bids)

`Authorization: Bearer <token>` is sent automatically on all requests where `auth: true` is used.

## Troubleshooting
If you see `No API key header was found` on Profile:
1. Confirm `NOROFF_API_KEY` is set (locally or in Netlify env vars).
2. Run a fresh build/deploy (`npm run build`).
3. In browser DevTools Network, confirm request headers include `X-Noroff-API-Key`.

## Git (first push)
```bash
git init
git branch -M main
git remote add origin https://github.com/LowrensRosinelli/SP2-Auction-House.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

Check that `node_modules` is not tracked:
```bash
git status --short
```

## Routes/pages
- `/index.html` -> auth page (login + register)
- `/listings` -> listings browse/search/filter/sort
- `/listing/:id` -> listing detail + bid history (+ bid form for valid users)
- `/profile` -> profile + credits + own listings + bid-on listings
- `/create` -> create listing with dynamic media rows (7+ valid URLs)

## Folder architecture
- `js/api/*` fetch/data only
- `js/ui/*` render/DOM updates only
- `js/events/*` listeners + controller logic
- `js/pages/*` per-page entrypoint
- `js/utils/*` storage/guards/formatters
