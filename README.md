# FireSafeX website

Next.js 15 / React 19 marketing homepage with a static export and a separate Convex booking backend. The active page is `components/home/BrochurePage.js`; older cinematic components remain in source but are not deployed by `app/page.js`.

## Development and verification

Use Node.js 22 or newer. The AWS pipeline uses npm and `package-lock.json`.

```sh
npm ci
npm run dev
npm run test:booking
npm run build
npm run audit:production
npm run validate:content
npm audit --omit=dev --audit-level=high
```

Preview the exported site with `python3 -m http.server 3000 --directory out`. `next start` is incompatible with this project's `output: 'export'` configuration. Production hosting serves `out/`; it does not run a Next.js server.

## Deployment

See [the production readiness report](Documents/production-readiness.md) for measured sizes, blockers, evidence and the release checklist. The existing Bitbucket pipeline uploads `out/` to S3 and invalidates CloudFront. It now checks production environment settings, installs locked dependencies and runs validation before upload.

Set `NEXT_PUBLIC_CONVEX_URL` to the production backend URL and `CONVEX_DEPLOYMENT=prod:<name>` in CI. The local `.env.local` targets development; do not copy it into a production deployment. Deploy the Convex functions separately, then build the frontend with its production URL. Secrets belong in Convex/CI settings, never `NEXT_PUBLIC_*` variables or `public/`.

## Media

`public/` contains only assets reviewed for the active homepage, all six training tabs, device details, video, brochure, and browser icons. `scripts/production-assets.json` records the allowed files. `npm run audit:production` rejects missing/unreviewed public files, assets over 5 MB, a public folder over 15 MB, or a static export over 20 MB.

Responsive WebP variants are checked in. Run `node scripts/media/optimize-responsive.mjs` after replacing an original WebP image, then rebuild and check the browser. Review and update the allowlist when adding media. Keep original photography, video masters and future concepts outside `public/`.

Unused media was archived outside the application in `../firesafex-unused-assets-2026-09-17/`. Legacy components and media tooling may require restoring their old assets from that archive before reuse. Do not deploy the archive, `node_modules`, `.next`, `Documents`, or audit evidence. Removing files from the working tree does not remove old Git history or existing copies in a remote S3 bucket.

## Google Sheets booking integration

Bookings can sync to a private Google Sheet through a backend-only Apps Script webhook. Follow [the connection guide](Documents/google-sheets-setup.md). Saving in Convex and queuing delivery are transactional; retry status is recorded with the enquiry. Google setup and backend deployment are still required. `npm run test:booking` covers validation and mocked delivery/idempotency checks.
