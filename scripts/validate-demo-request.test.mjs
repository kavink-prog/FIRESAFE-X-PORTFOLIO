import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDemoRequest } from '../convex/validateDemoRequest.js';
const valid = { fullName: ' Example Person ', company: 'Example', email: 'TEST@example.com', phone: '+91 9876543210', participants: 20, trainingDate: '2099-04-20', requirements: 'Factory safety training', source: 'website' };
test('normalizes valid booking data', () => {
  const clean = validateDemoRequest(valid);
  assert.equal(clean.fullName, 'Example Person');
  assert.equal(clean.email, 'test@example.com');
});
test('rejects malformed, oversized, and invalid booking data', () => {
  for (const change of [{ email: 'bad' }, { email: 'test @example.com' }, { fullName: ' ' }, { fullName: '---' }, { fullName: 'Valid\nInjected' }, { company: '***' }, { company: 'x'.repeat(201) }, { requirements: 'x'.repeat(4001) }, { participants: -1 }, { participants: 1.5 }, { participants: Infinity }, { participants: 100001 }, { phone: '123' }, { phone: '12345678 ext 4' }, { phone: '+1 234 567 890 123 456' }, { trainingDate: '2027-02-30' }, { trainingDate: 'not-a-date' }, { trainingDate: '2020-01-01' }]) {
    assert.throws(() => validateDemoRequest({ ...valid, ...change }));
  }
});

test('accepts international names, companies, and supported phone punctuation', () => {
  const clean = validateDemoRequest({
    ...valid,
    fullName: 'ரவி குமார்',
    company: 'அக்னி பாதுகாப்பு நிறுவனம்',
    phone: '+91 (98765) 43210',
  });
  assert.equal(clean.fullName, 'ரவி குமார்');
});
