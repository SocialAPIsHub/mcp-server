// The public shape of one SocialAPIs endpoint, as served by
// GET https://auth.socialapis.io/api/public/endpoints. Used to write
// src/catalogBaseline.json (scripts/snapshot-catalog.mjs) and to read the
// live catalog. Only these fields are ever kept: never upstream URLs,
// headers, timeouts or middlewares.

export const PUBLIC_FIELDS = ['route', 'method', 'description', 'queryParams', 'bodyParams', 'creditsRequired', 'creditRules', 'pricing'];

const unit = (n) => `${n} credit${n === 1 ? '' : 's'}`;

/** Same sentence as the API's price list ("1 credit; 5 credits when x=true"). */
export function describePricing(ep) {
  const base = ep?.creditsRequired ?? 1;
  const parts = [base === 0 ? 'Free' : unit(base)];
  for (const r of ep?.creditRules || []) {
    if (r.op === 'per') parts.push(`round(${r.param} ÷ ${r.value}) credits when ${r.param} is set, up to ${r.credits}`);
    else parts.push(`${unit(r.credits)} when ${r.param}${r.op === 'present' ? ' is set' : `=${r.value}`}`);
  }
  const max = ep?.maxCreditsPerRequest;
  if (Number.isInteger(max) && max !== 10) parts.push(`up to ${max} credits per call depending on the result`);
  return parts.join('; ');
}

const cleanParams = (list) =>
  (Array.isArray(list) ? list : [])
    .filter((p) => p && typeof p.name === 'string' && p.name)
    .map(({ name, type, required, description }) => ({ name, type: String(type || 'string'), required: !!required, description: String(description || '') }));

/** One endpoint config (endpoints.json or the live catalog) → public fields only. */
export function toPublicEndpoint(ep) {
  const out = {
    route: String(ep.route),
    method: String(ep.method || 'get').toLowerCase(),
    description: String(ep.description || ''),
    queryParams: cleanParams(ep.queryParams),
  };
  const body = cleanParams(ep.bodyParams);
  if (body.length) out.bodyParams = body;
  out.creditsRequired = Number.isFinite(ep.creditsRequired) ? ep.creditsRequired : 1;
  if (Array.isArray(ep.creditRules) && ep.creditRules.length) {
    out.creditRules = ep.creditRules.map(({ param, op, value, credits }) => ({ param, op, ...(op === 'present' ? {} : { value }), credits }));
  }
  if (typeof ep.pricing === 'string' && ep.pricing) out.pricing = ep.pricing;
  else if (out.creditRules || out.creditsRequired !== 1 || (ep.maxCreditsPerRequest ?? 10) !== 10) out.pricing = describePricing(ep);
  return out;
}

/** True for a usable catalog response: { endpoints: [{ route, method }, ...] }. */
export function isCatalog(data) {
  return !!data && Array.isArray(data.endpoints) && data.endpoints.length > 0
    && data.endpoints.every((e) => e && typeof e.route === 'string' && e.route.startsWith('/') && typeof e.method === 'string');
}

export const endpointKey = (method, route) => `${String(method).toLowerCase()} ${route}`;
