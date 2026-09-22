# Save FireSafeX bookings to Google Sheets

The local integration is prepared; it is **not connected or deployed yet**. Bookings are first saved in Convex, then an internal action sends a row to Google Sheets. A Sheet outage does not lose the saved enquiry or require the visitor to submit again.

## 1. Prepare the Sheet and Apps Script

1. Create a private Google Sheet for bookings (or use an existing spreadsheet with a new, empty `Bookings` tab).
2. Open **Extensions → Apps Script**. Paste the contents of [`Code.gs`](../integrations/google-sheets/Code.gs).
3. In Apps Script **Project Settings → Script Properties**, add:

| Property | Value |
| --- | --- |
| `SPREADSHEET_ID` | The part between `/d/` and `/edit` in the Google Sheet URL |
| `SHEET_NAME` | `Bookings` (or another empty tab name) |
| `WEBHOOK_SECRET` | A random secret of at least 32 characters |

Generate a secret locally with `openssl rand -hex 32`. Keep it in the Google/Convex settings; do not paste it into chat, source files or the website frontend. Use separate spreadsheets and secrets for development and production.

4. Choose **Deploy → New deployment → Web app**. Execute as **Me**; allow access to **Anyone**, then authorize the requested spreadsheet access. The script authenticates backend requests using the secret. The spreadsheet itself stays private. Some Workspace administrators disable anonymous web apps; if that option is unavailable, use a service-account Sheets API integration instead.
5. Copy the deployed web-app URL ending in `/exec`, not the editor URL or `/dev` testing URL. If you change the script later, edit its deployment and select a new version.

Google documents the deployment settings in its [web-app guide](https://developers.google.com/apps-script/guides/web).

## 2. Connect Convex

In the correct Convex deployment's **Settings → Environment Variables**, add:

| Variable | Value |
| --- | --- |
| `GOOGLE_SHEETS_WEBHOOK_URL` | The Apps Script `/exec` URL |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | The same value as `WEBHOOK_SECRET` |

These are backend-only values: do not prefix them with `NEXT_PUBLIC_`. Google OAuth or service-account credentials are not required in the browser.

Deploy the updated Convex functions from this repository using your normal production deployment process (`npx convex deploy` for production). Confirm which deployment you are targeting before running it. The website must point to that same production backend using `NEXT_PUBLIC_CONVEX_URL` when built. The checked-in code does not deploy itself and the current local environment previously targeted development.

## 3. Verify one submission

Submit an agreed test enquiry through the connected website. Confirm the saved record in Convex and one new row in the `Bookings` tab. The columns are:

`Request ID | Submitted at (UTC) | Full name | Company | Email | Phone | Participants | Preferred training date | Requirements | Source`

Keep the header row and Request ID column intact; do not use the booking tab for unrelated data. Formula-like input is stored as text, and phone numbers retain their `+` prefix. A lock and an exact booking-ID check prevent duplicate rows from delivery retries.

Each Convex record includes `sheetSyncStatus`, `sheetSyncAttempts`, and, after success, `sheetSyncedAt`. Possible statuses:

- `pending`: queued for delivery.
- `sent`: Google acknowledged that the row exists.
- `retrying`: another attempt is queued.
- `failed`: five attempts have failed; the original booking remains stored.
- `not_configured`: the endpoint or secret is missing/invalid; the original booking remains stored.

Retries occur after 1 minute, 5 minutes, 30 minutes and 2 hours, up to five delivery attempts. If an action is interrupted unexpectedly, inspect the scheduled function and sync status in Convex; manual retry is available. Saved old bookings are not automatically backfilled.

After fixing configuration, run the internal `demoRequests:retrySheetSync` function from the Convex dashboard with `{ "requestId": "<saved booking _id>" }` to retry/backfill a record. The function is not publicly callable. Do not submit the form again just to retry a Sheet transfer.

## Operational notes

This integration adds a Sheet row; it does not email or message anyone. Share the private Sheet only with the team that needs enquiry data. Keep the separate booking rate-limit/anti-bot work from the production checklist: a webhook secret protects the Sheet endpoint, not the public booking form. Google Apps Script is subject to account quotas; monitor failed transfers and use the official Sheets API or a dedicated queue if volume outgrows it.

The backend uses [Convex scheduled functions](https://docs.convex.dev/scheduling/scheduled-functions); saving the booking and queuing the first delivery happen in one transaction. Local tests mock Google and Convex services, so they do not prove that your Google deployment or production credentials are connected.
