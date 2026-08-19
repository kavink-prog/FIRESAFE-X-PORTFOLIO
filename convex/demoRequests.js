import { mutation } from './_generated/server';
import { v } from 'convex/values';

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
    return await ctx.db.insert('demoRequests', {
      ...request,
      status: 'new',
      createdAt: Date.now(),
    });
  },
});
