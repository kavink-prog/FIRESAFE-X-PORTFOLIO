/** Paste into the Google Sheet's Extensions > Apps Script project. */
const HEADERS = ['Request ID', 'Submitted at (UTC)', 'Full name', 'Company', 'Email', 'Phone', 'Participants', 'Preferred training date', 'Requirements', 'Source'];

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function safeCell(value) {
  const text = String(value);
  // Keep phone prefixes and user-entered formulas as literal text.
  return /^[\s]*[=+\-@]|^[\t\r\n]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  let lock;
  try {
    const config = PropertiesService.getScriptProperties();
    const expected = config.getProperty('WEBHOOK_SECRET');
    const raw = e && e.postData && e.postData.contents;
    if (!expected || expected.length < 32 || !raw || raw.length > 20000) return jsonResponse({ ok: false });
    const payload = JSON.parse(raw);
    if (typeof payload.secret !== 'string' || payload.secret !== expected) return jsonResponse({ ok: false });
    const b = payload.booking;
    if (!b || typeof b.requestId !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(b.requestId)) return jsonResponse({ ok: false });
    const limits = { fullName: 120, company: 200, email: 254, phone: 40, trainingDate: 10, requirements: 4000, source: 120 };
    for (const field in limits) {
      if (typeof b[field] !== 'string' || !b[field].trim() || b[field].length > limits[field]) return jsonResponse({ ok: false });
    }
    if (!Number.isSafeInteger(b.participants) || b.participants < 1 || b.participants > 100000 || !Number.isFinite(b.createdAt)) return jsonResponse({ ok: false });
    const submittedAt = new Date(b.createdAt).toISOString();
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return jsonResponse({ ok: false });
    const spreadsheet = SpreadsheetApp.openById(config.getProperty('SPREADSHEET_ID'));
    const tab = config.getProperty('SHEET_NAME') || 'Bookings';
    const sheet = spreadsheet.getSheetByName(tab) || spreadsheet.insertSheet(tab);
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
    } else {
      const header = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
      if (!HEADERS.every((value, i) => header[i] === value)) return jsonResponse({ ok: false });
    }
    // A network retry after a successful append must not create a second row.
    if (lastRow > 1 && sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(b.requestId).matchEntireCell(true).useRegularExpression(false).findNext()) {
      return jsonResponse({ ok: true, requestId: b.requestId });
    }
    const row = [b.requestId, submittedAt, b.fullName, b.company, b.email, b.phone, b.participants, b.trainingDate, b.requirements, b.source];
    sheet.getRange(Math.max(lastRow + 1, 2), 1, 1, row.length)
      .setNumberFormat('@')
      .setValues([row.map(value => typeof value === 'string' ? safeCell(value) : value)]);
    SpreadsheetApp.flush();
    return jsonResponse({ ok: true, requestId: b.requestId });
  } catch (_) {
    return jsonResponse({ ok: false });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}
