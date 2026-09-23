// Shared by the mutation and local boundary tests. Never rely on browser validation.
export function validateDemoRequest(request) {
  const limits = { fullName: 120, company: 200, email: 254, phone: 40, requirements: 4000, source: 120 };
  const clean = { ...request };
  for (const [field, limit] of Object.entries(limits)) {
    if (typeof request[field] !== 'string') throw new Error(`Invalid ${field}`);
    clean[field] = request[field].trim();
    if (!clean[field] || clean[field].length > limit) throw new Error(`Invalid ${field}`);
  }
  if (!/[\p{L}\p{N}]/u.test(clean.fullName) || /[\r\n]/.test(clean.fullName)) {
    throw new Error('Invalid fullName');
  }
  if (!/[\p{L}\p{N}]/u.test(clean.company) || /[\r\n]/.test(clean.company)) {
    throw new Error('Invalid company');
  }
  clean.email = clean.email.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email) || /[\r\n]/.test(clean.email)) {
    throw new Error('Invalid email');
  }
  const digits = clean.phone.replace(/\D/g, '');
  if (!/^[+\d().\-\s]+$/.test(clean.phone) || digits.length < 8 || digits.length > 15) {
    throw new Error('Invalid phone');
  }
  if (!Number.isSafeInteger(clean.participants) || clean.participants < 1 || clean.participants > 100000) {
    throw new Error('Invalid participants');
  }
  if (typeof clean.trainingDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(clean.trainingDate)) {
    throw new Error('Invalid training date');
  }
  const date = new Date(`${clean.trainingDate}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== clean.trainingDate) {
    throw new Error('Invalid training date');
  }
  if (clean.trainingDate < new Date().toISOString().slice(0, 10)) {
    throw new Error('Training date cannot be in the past');
  }
  return clean;
}
