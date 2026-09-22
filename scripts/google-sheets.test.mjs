import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { deliver } from '../convex/googleSheets.js';
import { create, recordSheetResult } from '../convex/demoRequests.js';
const originalFetch = globalThis.fetch;
const originalEnv = { url: process.env.GOOGLE_SHEETS_WEBHOOK_URL, secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET };
afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of [['GOOGLE_SHEETS_WEBHOOK_URL', originalEnv.url], ['GOOGLE_SHEETS_WEBHOOK_SECRET', originalEnv.secret]]) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});
const booking = { requestId: 'booking123', createdAt: 1800000000000, fullName: 'Test Person', company: 'Example', email: 'test@example.com', phone: '+919876543210', participants: 20, trainingDate: '2027-04-20', requirements: '=IMPORTXML("test")', source: 'website' };
function configured() {
  process.env.GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/testdeployment/exec';
  process.env.GOOGLE_SHEETS_WEBHOOK_SECRET = 'a'.repeat(64);
}
function context(status = 'pending') {
  const results = [];
  return { results, runQuery: async () => ({ ...booking, sheetSyncStatus: status }), runMutation: async (_, data) => { results.push(data); } };
}
test('saving a validated booking schedules its delivery in the mutation', async () => {
  const saved = [], jobs = [];
  const { requestId, createdAt, ...input } = booking;
  const id = await create._handler({ db: { insert: async (_, data) => { saved.push(data); return requestId; } }, scheduler: { runAfter: async (...args) => jobs.push(args) } }, input);
  assert.equal(id, requestId); assert.equal(saved[0].sheetSyncStatus, 'pending');
  assert.deepEqual(jobs[0][2], { requestId, attempt: 1 });
});
test('missing configuration preserves booking and reports not_configured', async () => {
  delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  globalThis.fetch = () => { throw new Error('must not call Google'); };
  const ctx = context(); await deliver._handler(ctx, { requestId: booking.requestId, attempt: 1 });
  assert.equal(ctx.results[0].status, 'not_configured');
});
test('Google acknowledgement marks delivery sent; already sent skips network', async () => {
  configured(); let calls = 0;
  globalThis.fetch = async (_, options) => { calls++; assert.equal(JSON.parse(options.body).booking.phone, booking.phone); return { ok: true, json: async () => ({ ok: true, requestId: booking.requestId }) }; };
  const ctx = context(); await deliver._handler(ctx, { requestId: booking.requestId, attempt: 1 });
  assert.equal(ctx.results[0].status, 'sent');
  await deliver._handler(context('sent'), { requestId: booking.requestId, attempt: 2 }); assert.equal(calls, 1);
});
test('network errors retry, and terminal errors stay visible without exposing data', async () => {
  configured(); globalThis.fetch = async () => { throw new Error('private request data'); };
  const ctx = context(); await deliver._handler(ctx, { requestId: booking.requestId, attempt: 1 });
  assert.equal(ctx.results[0].status, 'retrying'); assert.equal(ctx.results[0].retryDelay, 60000);
  await deliver._handler(ctx, { requestId: booking.requestId, attempt: 5 });
  assert.equal(ctx.results[1].status, 'failed'); assert.equal(ctx.results[1].retryDelay, undefined);
  assert.ok(!ctx.results[1].error.includes('private'));
});
test('a 200 response without a matching acknowledgement is a failure', async () => {
  configured(); globalThis.fetch = async () => ({ ok: true, json: async () => ({ ok: true, requestId: 'wrong-id' }) });
  const ctx = context(); await deliver._handler(ctx, { requestId: booking.requestId, attempt: 1 }); assert.equal(ctx.results[0].status, 'retrying');
});
test('a failed delivery cannot overwrite an already successful sync', async () => {
  const ctx = { db: { get: async () => ({ sheetSyncStatus: 'sent' }), patch: () => assert.fail('must not overwrite') }, scheduler: { runAfter: () => assert.fail('must not retry') } };
  await recordSheetResult._handler(ctx, { requestId: booking.requestId, status: 'failed', attempt: 2 });
});
function scriptContext() {
  const rows = []; let locked = false, opens = 0;
  const sheet = { getLastRow: () => rows.length, setFrozenRows: () => {}, getRange: (row, col, count) => {
    const range = { setNumberFormat: () => range, setValues: values => { rows[row - 1] = values[0]; return range; }, getValues: () => rows.slice(row - 1, row - 1 + count), createTextFinder: id => {
      const finder = { matchEntireCell: () => finder, useRegularExpression: () => finder, findNext: () => rows.slice(1).find(r => r[0] === id) || null }; return finder;
    } }; return range;
  } };
  const ctx = vm.createContext({ PropertiesService: { getScriptProperties: () => ({ getProperty: key => ({ WEBHOOK_SECRET: 'a'.repeat(64), SPREADSHEET_ID: 'testsheet', SHEET_NAME: 'Bookings' })[key] }) }, ContentService: { MimeType: { JSON: 'json' }, createTextOutput: value => ({ setMimeType: () => value }) }, LockService: { getScriptLock: () => ({ tryLock: () => { locked = true; return true; }, hasLock: () => locked, releaseLock: () => { locked = false; } }) }, SpreadsheetApp: { openById: () => { opens++; return { getSheetByName: () => sheet }; }, flush: () => {} } });
  vm.runInContext(fs.readFileSync('integrations/google-sheets/Code.gs', 'utf8'), ctx);
  return { ctx, rows, get opens() { return opens; }, get locked() { return locked; } };
}
test('Apps Script rejects unauthorized requests before accessing the Sheet', () => {
  const s = scriptContext(); const response = JSON.parse(s.ctx.doPost({ postData: { contents: JSON.stringify({ secret: 'wrong', booking }) } }));
  assert.equal(response.ok, false); assert.equal(s.opens, 0);
});
test('Apps Script writes one row per booking ID and stores formula-like fields as text', () => {
  const s = scriptContext(), event = { postData: { contents: JSON.stringify({ secret: 'a'.repeat(64), booking }) } };
  assert.equal(JSON.parse(s.ctx.doPost(event)).ok, true); assert.equal(JSON.parse(s.ctx.doPost(event)).ok, true);
  assert.equal(s.rows.length, 2); assert.equal(s.rows[1][5], "'" + booking.phone); assert.equal(s.rows[1][8], "'" + booking.requirements); assert.equal(s.locked, false);
});
