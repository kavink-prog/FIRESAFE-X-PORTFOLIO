// Run manually in the Apps Script editor. Reads settings; never writes a row.
function checkConfiguration() {
  const p = PropertiesService.getScriptProperties();
  const id = p.getProperty('SPREADSHEET_ID');
  const secret = p.getProperty('WEBHOOK_SECRET') || '';
  if (!id || id.includes('/')) throw new Error('SPREADSHEET_ID must contain only the document ID.');
  if (secret.length < 32) throw new Error('WEBHOOK_SECRET is missing or too short.');
  const fingerprint = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, secret, Utilities.Charset.UTF_8
  ).map(b => ((b + 256) % 256).toString(16).padStart(2, '0')).join('').slice(0, 12);
  const spreadsheet = SpreadsheetApp.openById(id);
  const tab = spreadsheet.getSheetByName(p.getProperty('SHEET_NAME') || 'Bookings');
  const headers = tab && tab.getLastRow() > 0
    ? tab.getRange(1, 1, 1, HEADERS.length).getValues()[0]
    : null;
  console.log(JSON.stringify({
    spreadsheetAccessible: true,
    tabExists: Boolean(tab),
    headersValid: !headers || HEADERS.every((h, i) => headers[i] === h),
    secretFingerprint: fingerprint
  }));
}
