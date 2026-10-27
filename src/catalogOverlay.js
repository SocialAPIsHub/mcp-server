// Apply live endpoint changes to the hand-written tool definitions.
//
// src/tools.js is written by hand (better wording than the API's one-line
// descriptions). src/catalogBaseline.json is the endpoint catalog it was
// written against. The live catalog (Settings → Endpoints on SocialAPIs) is
// compared with that baseline, and ONLY what changed since is applied:
//   - price changed        → the "Pricing: …" sentence is replaced
//   - description changed  → the live description (+ its price) replaces ours
//   - parameter added      → added to inputSchema (type + description)
//   - parameter removed    → removed from inputSchema
//   - parameter text / required changed → followed
//   - endpoint missing from the live catalog (disabled) → "Currently unavailable."
// Tool, group and action names never change. Routes in the live catalog that
// no tool covers are reported in `unmapped`, not added.
//
// Pure: no I/O. Returns deep copies; the inputs are never modified.

import { endpointKey } from './publicCatalog.js';

const unit = (n) => `${n} credit${n === 1 ? '' : 's'}`;
const TYPES = new Set(['string', 'number', 'integer', 'boolean']);
const clone = (v) => JSON.parse(JSON.stringify(v));

const priceSignature = (ep) => JSON.stringify([ep?.creditsRequired ?? 1, ep?.creditRules || [], ep?.pricing || '']);
const priceSentence = (ep) => `Pricing: ${ep.pricing || `${unit(ep.creditsRequired ?? 1)} per call`}.`;
const allParams = (ep) => [...(ep?.queryParams || []), ...(ep?.bodyParams || [])];
const byName = (list) => new Map(list.map((p) => [p.name, p]));

/** Replace the trailing "Pricing: …" sentence, or append one. */
export function setPricing(description, sentence) {
  const text = String(description || '').trimEnd();
  const i = text.lastIndexOf('Pricing:');
  if (i >= 0) return `${text.slice(0, i)}${sentence}`;
  return text ? `${text}${/[.!?]$/.test(text) ? '' : '.'} ${sentence}` : sentence;
}

const stripPricing = (text) => {
  const i = String(text || '').indexOf('Pricing:');
  return (i >= 0 ? text.slice(0, i) : String(text || '')).trim();
};

/**
 * @param {object[]} tools     bundled tool definitions (src/tools.js)
 * @param {object|null} live   live catalog { endpoints: [...] }, null = not loaded
 * @param {object} baseline    src/catalogBaseline.json { endpoints: [...] }
 * @returns {{ tools: object[], changes: string[], unmapped: string[], matched: number }}
 *   matched = tools whose endpoint is in the live catalog
 */
export function applyCatalog(tools, live, baseline) {
  const out = clone(tools);
  if (!live || !Array.isArray(live.endpoints)) return { tools: out, changes: [], unmapped: [], matched: 0 };

  const liveMap = new Map(live.endpoints.map((e) => [endpointKey(e.method, e.route), e]));
  const baseMap = new Map((baseline?.endpoints || []).map((e) => [endpointKey(e.method, e.route), e]));
  const changes = [];
  const covered = new Set();
  let matched = 0;

  for (const tool of out) {
    if (!tool.endpoint) continue;
    const key = endpointKey(tool.method || 'GET', tool.endpoint);
    covered.add(key);
    const L = liveMap.get(key);
    const B = baseMap.get(key);

    if (!L) {
      tool.unavailable = true;
      tool.description = `${String(tool.description).trimEnd()} Currently unavailable.`;
      changes.push(`${tool.name}: unavailable`);
      continue;
    }
    matched += 1;
    if (!B) continue; // newer than the baseline: tools.js is the reference

    // Description edited in the admin: use it, with the live price.
    const descChanged = stripPricing(L.description) !== stripPricing(B.description);
    if (descChanged) {
      tool.description = setPricing(stripPricing(L.description), priceSentence(L));
      changes.push(`${tool.name}: description`);
    } else if (priceSignature(L) !== priceSignature(B)) {
      tool.description = setPricing(tool.description, priceSentence(L));
      changes.push(`${tool.name}: pricing`);
    }

    // Parameters.
    const schema = tool.inputSchema || (tool.inputSchema = { type: 'object', properties: {}, required: [] });
    schema.properties ||= {};
    let required = new Set(schema.required || []);
    const lp = byName(allParams(L));
    const bp = byName(allParams(B));

    for (const [name] of bp) {
      if (!lp.has(name) && name in schema.properties) {
        delete schema.properties[name];
        required.delete(name);
        changes.push(`${tool.name}: -${name}`);
      }
    }
    for (const [name, p] of lp) {
      const before = bp.get(name);
      if (!before) {
        if (name in schema.properties) continue;
        schema.properties[name] = { type: TYPES.has(p.type) ? p.type : 'string', ...(p.description ? { description: p.description } : {}) };
        if (p.required) required.add(name);
        changes.push(`${tool.name}: +${name}`);
        continue;
      }
      if (!(name in schema.properties)) continue; // left out of the tool on purpose
      if ((p.description || '') !== (before.description || '') && p.description) {
        schema.properties[name] = { ...schema.properties[name], description: p.description };
        changes.push(`${tool.name}: ${name} description`);
      }
      if (!!p.required !== !!before.required) {
        if (p.required) required.add(name);
        else required.delete(name);
        changes.push(`${tool.name}: ${name} ${p.required ? 'required' : 'optional'}`);
      }
    }
    schema.required = [...required];
  }

  const unmapped = [...liveMap.keys()].filter((k) => !covered.has(k) && !k.startsWith('get /usage'));
  return { tools: out, changes, unmapped, matched };
}
