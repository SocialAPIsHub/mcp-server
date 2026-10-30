// src/errorGuidance.js
// A failed API call returns the API's own JSON. Agents often retry a 429 at
// once or keep calling with no credits left, so the tool result also carries
// a plain `hint` (what to do next) and, for rate limits, `retryAfterSeconds`.
// The API's fields are kept as they are; only `hint` / `retryAfterSeconds`
// are added, and only on errors.

const TOP_UP_URL = 'https://socialapis.io/dashboard/billing';
const PRICING_URL = 'https://socialapis.io/pricing';
const KEYS_URL = 'https://socialapis.io/dashboard';

function seconds(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.ceil(n) : null;
}

/**
 * @param {number} status   HTTP status of the API response
 * @param {{ get(name: string): string | null }} headers  response headers
 * @param {any} data        parsed JSON body (object, or anything else)
 * @returns {any} data with `hint` (+ `retryAfterSeconds`) added on errors
 */
export function withGuidance(status, headers, data) {
  if (status >= 200 && status < 300) return data;
  const body = data && typeof data === 'object' && !Array.isArray(data) ? data : { error: data };
  const code = String(body.code || '');
  const text = `${body.error || ''} ${body.message || ''}`.toLowerCase();

  if (status === 429) {
    const retry = seconds(headers?.get?.('retry-after')) ?? seconds(body.retryAfter) ?? seconds(body.windowSeconds);
    return {
      ...body,
      ...(retry ? { retryAfterSeconds: retry } : {}),
      hint: `Rate limit reached for this API key${retry ? `: wait ${retry} s` : ''} before calling again, and slow down (fewer calls per second). Don't retry immediately. Higher limits come with bigger plans: ${PRICING_URL}`,
    };
  }
  if (status === 403 && (text.includes('insufficient credits') || Number.isFinite(body.creditsNeeded))) {
    return {
      ...body,
      hint: `Not enough credits for this call${Number.isFinite(body.creditsNeeded) ? ` (needs ${body.creditsNeeded}, ${body.creditsRemaining ?? 0} left)` : ''}. Don't retry: top up or upgrade at ${TOP_UP_URL}`,
    };
  }
  if (status === 403 && code === 'SUBSCRIPTION_PAUSED') {
    return { ...body, hint: 'This account is paused. Retrying won\'t help: the account owner should contact support@socialapis.io.' };
  }
  if (status === 403 && (text.includes('expired') || code.includes('EXPIRED'))) {
    return { ...body, hint: `The plan for this API key has expired. Don't retry: renew at ${PRICING_URL}` };
  }
  if (status === 401) {
    return { ...body, hint: `The API key is missing or invalid. Check the key, or create one at ${KEYS_URL}` };
  }
  if (status >= 500) {
    return { ...body, hint: 'The API had a temporary problem. Retry once after a few seconds; if it keeps failing, try again later.' };
  }
  return body;
}
