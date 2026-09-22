# FireSafeX production readiness — 17 September 2026

**Decision: not yet approved for production.** The cleaned static site builds and passes the checks below, but the production booking backend, abuse protection, enquiry handling, and live hosting configuration still need verification. No cloud deployment, live form submission, remote file deletion, or Git push was performed.

## Website weight

All sizes below are decimal MB/GB, not filesystem allocation sizes.

| Measurement | Before | After |
| --- | ---: | ---: |
| Public assets | 4.69 GB (404 files) | 9.70 MB (51 files) |
| Complete current static export (`out/`) | Not recorded as an exact baseline | 11.01 MB |
| Initial mobile asset transfer, 390px / DPR 1 | 3.71 MB | 0.67 MB |
| Initial desktop asset transfer, 1440px / DPR 1 | 3.71 MB | 0.76 MB |
| Hero source image | 2.13 MB PNG | 0.135 MB WebP, with a smaller phone variant |
| Corporate logo served to browsers | 504 KB PNG | 17.5 KB WebP |

Public assets are **99.79% smaller**. Initial asset measurements use fresh browser pages after network idle and exclude the HTML navigation request. They are not total downloads after scrolling, opening all tabs, playing the video or downloading the brochure. The local test server did not use CDN compression or caching.

The active demo video is 2.91 MB and uses `preload="none"`; the brochure is 2.66 MB and downloads on request. Those files account for most of the deployable media. `node_modules`, `.next`, source files and source Git history are not part of `out/`.

## Cleanup and changes

- Archived 376 unused files (4.68 GB), including four very large video masters, old sequence frames, duplicate images, drafts and unused logos.
- Archive: `../firesafex-unused-assets-2026-09-17/`; restore files using its `manifest.json`. This removes media from deployment, not from local disk or Git history. The archive is outside the application and must not be uploaded.
- Preserved assets for all six training tabs, expanded equipment details, the demo, brochure, footer companies and browser icons. Converted the supplied corporate artwork without changing its design.
- Added responsive image variants and deferred the Convex client until a validated form submission.
- Updated Next.js to 15.5.25, React/React DOM to 19.0.8, Convex to 1.46.0 and Sharp to 0.35.4. Pinned compatible PostCSS/Nanoid overrides resolve remaining audit findings; npm and pnpm dependency settings were updated. A clean npm install and build passed.
- Added server-side booking field lengths, normalization, email/phone checks, participant bounds and calendar-date validation. Media upload URLs now require a server-side admin secret and fail closed when it is absent. These backend changes are local until Convex is deployed.
- Added `robots.txt`, `sitemap.xml`, social-preview metadata, a reviewed asset manifest and deployment-size budgets.
- Updated the existing AWS pipeline to check the production environment, use `npm ci`, and run the dependency audit, booking tests, build, asset audit and content check before upload. Its existing deployment trigger remains the `develop` branch; review that release workflow before pushing.

Older cinematic source components remain in the repository but are not imported by the active page. Their removed media must be restored from the archive if those components are reused. The old content validation assumed the retired seven-section layout; it now checks the active brochure homepage.

## Verified locally

- Production-mode static build succeeded. Current build still embeds the development backend URL; rebuild with production settings before release.
- Exported HTML links and asset paths passed validation. All reviewed public files exist; no unreviewed public assets remain.
- Desktop 1440px and mobile 390px: no broken images, failed HTTP responses, JavaScript exceptions, broken section anchors or horizontal overflow.
- All training tabs, expanded equipment details, booking open/close and focus restoration passed browser checks.
- Empty bookings were blocked; successful and failed submissions were tested with intercepted responses. No test records were sent to Convex. Real backend persistence and notifications are **not** verified.
- Booking validation unit tests passed. `npm audit` and the production-only audit reported zero known vulnerabilities at audit time; this is not a complete security certification.
- `npm run lint` is not operational without setup: it opens the Next.js ESLint configuration prompt. Configure a non-interactive linter before making lint a release gate. Compiler/type validation ran during the build; a standalone lint pass is not claimed.

## Mobile Lighthouse result

Lighthouse 13.4.1, Chrome headless, default simulated mobile throttling, local uncompressed HTTP static export:

| Category / metric | Result |
| --- | ---: |
| Performance | 79/100 |
| Accessibility | 100/100 |
| Best practices | 100/100 |
| SEO | 100/100 |
| Largest Contentful Paint | 5.5 s |
| Total Blocking Time | 40 ms |
| Cumulative Layout Shift | 0 |

The mobile performance result still needs improvement/verification on the actual CDN. It is not a real-user Core Web Vitals pass. Lighthouse found absent compression/cache headers on the local test server, plus remaining CSS/JavaScript opportunities. Retest the preview domain with CDN compression before release; continue performance work if LCP remains high. Target field p75 LCP ≤2.5s, INP ≤200ms and CLS ≤0.1, following [Web Vitals guidance](https://web.dev/articles/vitals).

## Required before launch

1. **Production backend:** local `CONVEX_DEPLOYMENT` is `dev:`. Deploy the reviewed Convex functions to production, then set matching `CONVEX_DEPLOYMENT=prod:<name>` and `NEXT_PUBLIC_CONVEX_URL=https://<name>.convex.cloud` in CI. Never publish `.env.local`. Run one agreed end-to-end test and confirm the record in the production dashboard.
2. **Enquiry operations and spam controls:** the backend saves records and now includes an optional Google Sheets sync (see `google-sheets-setup.md`); the Sheet connection is not configured, and no email notification workflow is present. Assign someone to monitor requests or implement notification delivery. Add server-side rate limiting and/or a verified anti-bot challenge to the public booking endpoint. An AWS rule protecting only the static site would not protect direct Convex requests. Confirm the fallback `hello@firesafex.ai` mailbox exists.
3. **Backend upload restriction:** deploy the upload fix. If legacy admin uploads are needed, set the same strong `MEDIA_UPLOAD_ADMIN_TOKEN` in Convex and the trusted operator environment. Never put it in a `NEXT_PUBLIC_*` variable. Otherwise leave it unset so uploads remain disabled.
4. **Hosting and DNS:** confirm AWS S3/CloudFront is the intended production target and `https://firesafex.ai` is the final canonical domain. The existing pipeline suggests AWS, but no live infrastructure was inspected. Configure the certificate, DNS, HTTP-to-HTTPS redirect, canonical host redirect, root index and proper 404 handling. Do not map arbitrary missing assets to a 200 HTML homepage.
5. **Compression, caching and headers:** enable CloudFront automatic compression with Gzip and Brotli, then verify response headers. Use long immutable caching for hashed `/_next/static/` files, short/revalidated HTML caching and an intentional policy for non-hashed media. Configure appropriate security headers at the CDN; `next.config.js` headers do not apply to static exports. See [AWS compression documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html).
6. **Deploy only `out/`:** configure the pipeline image with Node 22 or newer. Run the checks below with production settings, publish a preview and test it on mobile. The current S3 sync does **not** delete old remote objects. Review a scoped cleanup/dry-run against the correct dedicated bucket or prefix before removing old media remotely; the local archive is not a remote rollback backup.
7. **Release verification:** check video play/pause/seeking, brochure download, six training tabs, phone/email links, keyboard navigation, form errors/success, metadata and social previews on the final domain. Confirm content, testimonials, image usage and a privacy notice appropriate to the enquiry data collected. Preview Lighthouse scores do not replace this review.
8. **Operations:** keep the prior release or S3 versioning for rollback, verify the CloudFront invalidation, set up error/uptime monitoring, and define who handles failed bookings. Establish a non-interactive lint configuration and an ongoing dependency update schedule.

## Repeatable checks

```sh
npm ci --engine-strict
node scripts/check-production-env.mjs  # CI variables must already be set
npm audit --omit=dev --audit-level=high
npm run test:booking
npm run build
npm run audit:production
npm run validate:content
```

The environment check intentionally fails against development settings. Production budgets are 5 MB per public asset, 15 MB total public files and 20 MB total export. Update `scripts/production-assets.json` deliberately when adding media, and use `node scripts/media/optimize-responsive.mjs` to regenerate phone-sized variants.

## Evidence

Local generated evidence lives in `output/production-audit/` (excluded from Git): `before-assets.json`, `removed-assets.json`, `after-assets.json`, before/after browser JSON and screenshots, `form-checks.json`, `dependencies.json`, and `lighthouse-final-mobile.report.html` / `.json`. Browser checks used Python Playwright and intercepted form responses. No hosted performance measurements or production backend delivery claims are made.

Framework patch background: [Next.js security advisories](https://github.com/vercel/next.js/security/advisories).
