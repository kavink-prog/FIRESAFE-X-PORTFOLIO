'use node';

import { internalAction } from './_generated/server.js';
import { internal } from './_generated/api.js';
import { v } from 'convex/values';

const RETRY_DELAYS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 60 * 60_000];

export const deliver = internalAction({
  args: { requestId: v.id('demoRequests'), attempt: v.number() },
  handler: async (ctx, { requestId, attempt }) => {
    const request = await ctx.runQuery(internal.demoRequests.forSheet, { requestId });
    if (!request || request.sheetSyncStatus === 'sent') return;
    const endpoint = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
    if (!endpoint || !secret) {
      await ctx.runMutation(internal.demoRequests.recordSheetResult, {
        requestId, status: 'not_configured', attempt, error: 'Google Sheets settings are missing.',
      });
      return;
    }
    // Only send enquiry data and the secret to the configured Google Apps Script endpoint.
    const validEndpoint = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint);
    if (!validEndpoint || secret.length < 32) {
      await ctx.runMutation(internal.demoRequests.recordSheetResult, {
        requestId, status: 'not_configured', attempt, error: 'Invalid Google Sheets endpoint or secret.',
      });
      return;
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(30_000),
        body: JSON.stringify({
          secret,
          booking: {
            requestId: String(requestId), createdAt: request.createdAt,
            fullName: request.fullName, company: request.company,
            email: request.email, phone: request.phone,
            participants: request.participants, trainingDate: request.trainingDate,
            requirements: request.requirements, source: request.source,
          },
        }),
      });
      if (!response.ok) throw new Error('Delivery rejected');
      const result = await response.json();
      if (result.ok !== true || result.requestId !== String(requestId)) throw new Error('Missing acknowledgement');
      await ctx.runMutation(internal.demoRequests.recordSheetResult, {
        requestId, status: 'sent', attempt,
      });
    } catch {
      // Do not log request bodies, personal information, secrets, or Google error pages.
      await ctx.runMutation(internal.demoRequests.recordSheetResult, {
        requestId, status: attempt <= RETRY_DELAYS.length ? 'retrying' : 'failed', attempt,
        error: 'Google Sheets did not acknowledge delivery. Check deployment settings and availability.',
        ...(attempt <= RETRY_DELAYS.length ? { retryDelay: RETRY_DELAYS[attempt - 1] } : {}),
      });
    }
  },
});
