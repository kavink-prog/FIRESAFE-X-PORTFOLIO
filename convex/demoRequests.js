import { mutation, internalQuery, internalMutation } from './_generated/server.js';
import { internal } from './_generated/api.js';
import { v } from 'convex/values';
import { validateDemoRequest } from './validateDemoRequest.js';

export const create = mutation({
  args: {
    fullName: v.string(),
    company: v.string(),
    email: v.string(),
    phone: v.string(),
    participants: v.number(),
    trainingDate: v.string(),
    requirements: v.string(),
    source: v.string(),
  },
  handler: async (ctx, request) => {
    const requestId = await ctx.db.insert('demoRequests', {
      ...validateDemoRequest(request),
      status: 'new',
      createdAt: Date.now(),
      sheetSyncStatus: 'pending',
      sheetSyncAttempts: 0,
    });
    await ctx.scheduler.runAfter(0, internal.googleSheets.deliver, { requestId, attempt: 1 });
    return requestId;
  },
});

// Internal functions cannot be called by website visitors.
export const forSheet = internalQuery({
  args: { requestId: v.id('demoRequests') },
  handler: async (ctx, { requestId }) => await ctx.db.get(requestId),
});

export const recordSheetResult = internalMutation({
  args: {
    requestId: v.id('demoRequests'),
    status: v.union(v.literal('sent'), v.literal('retrying'), v.literal('failed'), v.literal('not_configured')),
    attempt: v.number(), error: v.optional(v.string()), retryDelay: v.optional(v.number()),
  },
  handler: async (ctx, { requestId, status, attempt, error, retryDelay }) => {
    const request = await ctx.db.get(requestId);
    if (!request || request.sheetSyncStatus === 'sent') return;
    await ctx.db.patch(requestId, {
      sheetSyncStatus: status, sheetSyncAttempts: attempt,
      sheetSyncError: error, sheetSyncedAt: status === 'sent' ? Date.now() : undefined,
    });
    if (retryDelay !== undefined) {
      await ctx.scheduler.runAfter(retryDelay, internal.googleSheets.deliver, { requestId, attempt: attempt + 1 });
    }
  },
});

// Run from the Convex dashboard to backfill/retry one saved booking after setup.
export const retrySheetSync = internalMutation({
  args: { requestId: v.id('demoRequests') },
  handler: async (ctx, { requestId }) => {
    const request = await ctx.db.get(requestId);
    if (!request) throw new Error('Booking not found');
    if (request.sheetSyncStatus === 'sent') return;
    await ctx.db.patch(requestId, { sheetSyncStatus: 'pending', sheetSyncAttempts: 0, sheetSyncError: undefined });
    await ctx.scheduler.runAfter(0, internal.googleSheets.deliver, { requestId, attempt: 1 });
  },
});
