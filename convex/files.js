import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Hands the uploader a short-lived URL to POST raw file bytes to. The POST
// responds with { storageId }, which we then resolve to a public URL below.
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Resolves a stored file to its stable, public serving URL
// (https://<deployment>.convex.cloud/api/storage/<id>).
export const getUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, { storageId }) => await ctx.storage.getUrl(storageId),
});
