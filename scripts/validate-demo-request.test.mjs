import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDemoRequest } from '../convex/validateDemoRequest.js';
const valid = { fullName: ' Example Person ', company: 'Example', email: 'TEST@example.com', phone: '+91 9876543210', participants: 20, trainingDate: '2027-04-20', requirements: 'Factory safety training', source: 'website' };
test('normalizes valid booking data', () => {
  const clean = validateDemoRequest(valid);
  assert.equal(clean.fullName, 'Example Person');
  assert.equal(clean.email, 'test@example.com');
});
test('rejects malformed, oversized, and invalid booking data', () => {
  for (const change of [{ email: 'bad' }, { fullName: ' ' }, { company: 'x'.repeat(201) }, { requirements: 'x'.repeat(4001) }, { participants: -1 }, { participants: 1.5 }, { participants: Infinity }, { phone: '123' }, { trainingDate: '2027-02-30' }, { trainingDate: 'not-a-date' }]) {
    assert.throws(() => validateDemoRequest({ ...valid, ...change }));
  }
});
