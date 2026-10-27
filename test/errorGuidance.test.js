import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withGuidance } from '../src/errorGuidance.js';

const headers = (h = {}) => ({ get: (n) => h[n.toLowerCase()] ?? null });

test('success is returned untouched', () => {
  const data = { data: [1, 2] };
  assert.equal(withGuidance(200, headers(), data), data);
});

test('429 adds retryAfterSeconds from Retry-After and a hint, keeps the API fields', () => {
  const out = withGuidance(429, headers({ 'retry-after': '60' }), { code: 'RATE_LIMIT_EXCEEDED', limit: 1, windowSeconds: 60 });
  assert.equal(out.retryAfterSeconds, 60);
  assert.equal(out.code, 'RATE_LIMIT_EXCEEDED');
  assert.match(out.hint, /wait 60 s/);
  assert.match(out.hint, /Don't retry immediately/);
});

test('429 without the header falls back to the body', () => {
  assert.equal(withGuidance(429, headers(), { retryAfter: 30 }).retryAfterSeconds, 30);
});

test('insufficient credits says how many and not to retry', () => {
  const out = withGuidance(403, headers(), { error: 'Insufficient credits', creditsNeeded: 2, creditsRemaining: 0 });
  assert.match(out.hint, /needs 2, 0 left/);
  assert.match(out.hint, /Don't retry/);
});

test('paused, expired, bad key and 5xx get their own hint; other errors stay as they are', () => {
  assert.match(withGuidance(403, headers(), { code: 'SUBSCRIPTION_PAUSED' }).hint, /paused/);
  assert.match(withGuidance(403, headers(), { message: 'Subscription expired' }).hint, /expired/);
  assert.match(withGuidance(401, headers(), { error: 'Invalid API key' }).hint, /missing or invalid/);
  assert.match(withGuidance(502, headers(), { error: 'Bad gateway' }).hint, /Retry once/);
  assert.deepEqual(withGuidance(400, headers(), { error: 'bad param' }), { error: 'bad param' });
});

test('a non-object body is wrapped', () => {
  assert.deepEqual(withGuidance(400, headers(), 'oops'), { error: 'oops' });
});
