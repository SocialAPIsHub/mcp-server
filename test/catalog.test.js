import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { tools } from '../src/tools.js';
import { GROUPS, groupedTools, buildGroupedTools, resolveCall } from '../src/groups.js';
import { applyCatalog, setPricing } from '../src/catalogOverlay.js';
import { toPublicEndpoint, PUBLIC_FIELDS } from '../src/publicCatalog.js';
import {
  applyLiveCatalog, refreshCatalog, currentTools, currentGroupedTools, catalogStatus, _resetForTest,
} from '../src/liveCatalog.js';

const baseline = JSON.parse(readFileSync(new URL('../src/catalogBaseline.json', import.meta.url), 'utf8'));
const clone = (v) => JSON.parse(JSON.stringify(v));
const live = () => clone(baseline);
const find = (list, route) => list.endpoints.find((e) => e.route === route);
const tool = (list, name) => list.find((t) => t.name === name);
const quiet = { log: () => {} };

afterEach(() => _resetForTest());

test('baseline has only public fields (no upstream URL, headers, timeout, middlewares)', () => {
  const text = readFileSync(new URL('../src/catalogBaseline.json', import.meta.url), 'utf8');
  for (const word of ['targetUrl', 'headers', 'timeout', 'middlewares', 'http://', 'X_SOCIALAPIS_SECRET', '"note"']) {
    assert.ok(!text.includes(word), `baseline contains ${word}`);
  }
  for (const ep of baseline.endpoints) {
    for (const key of Object.keys(ep)) assert.ok(PUBLIC_FIELDS.includes(key), `unexpected field ${key}`);
  }
});

test('toPublicEndpoint drops private fields and computes pricing', () => {
  const ep = toPublicEndpoint({
    route: '/x', method: 'GET', description: 'd', targetUrl: 'http://10.0.0.1/x', headers: { a: 'b' }, timeout: 5, middlewares: ['m'],
    queryParams: [{ name: 'q', type: 'string', required: true, description: 'Q', extra: 1 }],
    creditRules: [{ param: 'deep', op: 'equals', value: 'true', credits: 5, note: 'internal' }],
  });
  assert.deepEqual(Object.keys(ep).sort(), ['creditRules', 'creditsRequired', 'description', 'method', 'pricing', 'queryParams', 'route']);
  assert.equal(ep.method, 'get');
  assert.equal(ep.pricing, '1 credit; 5 credits when deep=true');
  assert.deepEqual(ep.creditRules, [{ param: 'deep', op: 'equals', value: 'true', credits: 5 }]);
});

test('every tool endpoint is in the baseline', () => {
  const keys = new Set(baseline.endpoints.map((e) => `${e.method} ${e.route}`));
  for (const t of tools) assert.ok(keys.has(`get ${t.endpoint}`), `${t.name} (${t.endpoint}) missing from baseline`);
});

test('live catalog identical to the baseline → identical definitions', () => {
  const { tools: out, changes } = applyCatalog(tools, live(), baseline);
  assert.deepEqual(out, tools);
  assert.deepEqual(changes, []);
  assert.deepEqual(buildGroupedTools(out), groupedTools);
});

test('no live catalog → bundled definitions', () => {
  assert.deepEqual(applyCatalog(tools, null, baseline).tools, tools);
});

test('price change replaces the Pricing sentence', () => {
  const l = live();
  Object.assign(find(l, '/facebook/pages/id'), { creditsRequired: 2, pricing: '2 credits' });
  const out = applyCatalog(tools, l, baseline).tools;
  const t = tool(out, 'facebook_get_page_id');
  assert.match(t.description, /Pricing: 2 credits\.$/);
  assert.ok(t.description.startsWith('Resolve a Facebook page URL'));
  assert.equal(t.description.match(/Pricing:/g).length, 1);
});

test('setPricing appends when there is no Pricing sentence', () => {
  assert.equal(setPricing('Does a thing', 'Pricing: 1 credit per call.'), 'Does a thing. Pricing: 1 credit per call.');
});

test('description edited in the admin replaces ours, with its price', () => {
  const l = live();
  find(l, '/facebook/pages/details').description = 'New wording from the admin.';
  const t = tool(applyCatalog(tools, l, baseline).tools, 'facebook_get_page_details');
  assert.equal(t.description, 'New wording from the admin. Pricing: 1 credit; 5 credits when exact_followers_count=true.');
});

test('param added, removed, re-described and made required', () => {
  const l = live();
  const ep = find(l, '/facebook/pages/posts');
  ep.queryParams = ep.queryParams.filter((p) => p.name !== 'timezone');
  ep.queryParams.push({ name: 'include_ads', type: 'boolean', required: false, description: 'Also return ads.' });
  ep.queryParams.find((p) => p.name === 'end_cursor').description = 'Cursor from the last call.';
  ep.queryParams.find((p) => p.name === 'after_time').required = true;
  const t = tool(applyCatalog(tools, l, baseline).tools, 'facebook_get_page_posts');
  const props = t.inputSchema.properties;
  assert.ok(!('timezone' in props));
  assert.deepEqual(props.include_ads, { type: 'boolean', description: 'Also return ads.' });
  assert.equal(props.end_cursor.description, 'Cursor from the last call.');
  assert.deepEqual(props.limit, tool(tools, 'facebook_get_page_posts').inputSchema.properties.limit); // untouched
  assert.ok(t.inputSchema.required.includes('after_time'));
  // grouped tool picks it up; names unchanged
  const grouped = buildGroupedTools(applyCatalog(tools, l, baseline).tools);
  assert.deepEqual(grouped.map((g) => g.name), groupedTools.map((g) => g.name));
  const page = grouped.find((g) => g.name === 'facebook_page');
  assert.ok('include_ads' in page.inputSchema.properties);
  assert.deepEqual(page.inputSchema.properties.action.enum, groupedTools.find((g) => g.name === 'facebook_page').inputSchema.properties.action.enum);
});

test('unknown param type falls back to string', () => {
  const l = live();
  find(l, '/facebook/pages/id').queryParams.push({ name: 'weird', type: 'date', required: false, description: '' });
  const t = tool(applyCatalog(tools, l, baseline).tools, 'facebook_get_page_id');
  assert.deepEqual(t.inputSchema.properties.weird, { type: 'string' });
});

test('endpoint missing from the live catalog (disabled) → Currently unavailable', () => {
  const l = live();
  l.endpoints = l.endpoints.filter((e) => e.route !== '/facebook/pages/reels');
  const { tools: out, matched } = applyCatalog(tools, l, baseline);
  const t = tool(out, 'facebook_get_page_reels');
  assert.ok(t.unavailable);
  assert.match(t.description, /Currently unavailable\.$/);
  assert.equal(matched, tools.length - 1);
});

test('new live routes are reported, never added as tools', () => {
  const l = live();
  l.endpoints.push({ route: '/tiktok/profile', method: 'get', description: 'x', queryParams: [], creditsRequired: 1 });
  const { tools: out, unmapped } = applyCatalog(tools, l, baseline);
  assert.equal(out.length, tools.length);
  assert.deepEqual(unmapped, ['get /tiktok/profile']);
});

test('inputs are never modified', () => {
  const before = clone(tools);
  const l = live();
  find(l, '/facebook/pages/id').description = 'changed';
  applyCatalog(tools, l, baseline);
  assert.deepEqual(tools, before);
});

test('resolveCall validates against the overlaid list', () => {
  const l = live();
  find(l, '/facebook/pages/posts').queryParams.find((p) => p.name === 'after_time').required = true;
  const out = applyCatalog(tools, l, baseline).tools;
  assert.ok(!resolveCall('facebook_page', { action: 'posts', link: 'x' }).error);
  assert.match(resolveCall('facebook_page', { action: 'posts', link: 'x' }, out).error, /after_time/);
});

test('applyLiveCatalog: live state, status shape, names stable', () => {
  const l = live();
  find(l, '/facebook/pages/id').creditsRequired = 3;
  find(l, '/facebook/pages/id').pricing = '3 credits';
  assert.equal(applyLiveCatalog({ version: 42, count: l.endpoints.length, endpoints: l.endpoints }, quiet), true);
  const status = catalogStatus();
  assert.deepEqual(Object.keys(status).sort(), ['fetchedAt', 'routes', 'source', 'version']);
  assert.equal(status.source, 'live');
  assert.equal(status.version, 42);
  assert.equal(status.routes, tools.length);
  assert.match(tool(currentTools(), 'facebook_get_page_id').description, /Pricing: 3 credits\.$/);
  assert.deepEqual(currentGroupedTools().map((g) => g.name), GROUPS.map((g) => g.name));
});

test('bad response keeps the previous definitions', () => {
  assert.equal(applyLiveCatalog({ nope: true }, quiet), false);
  assert.equal(catalogStatus().source, 'bundled');
  assert.equal(currentTools(), tools);
  assert.deepEqual(catalogStatus(), { source: 'bundled', version: null, fetchedAt: null, routes: 0 });
});

test('a change that no longer groups cleanly keeps the previous set', () => {
  const first = live();
  find(first, '/facebook/pages/id').pricing = '2 credits';
  find(first, '/facebook/pages/id').creditsRequired = 2;
  assert.equal(applyLiveCatalog({ version: 1, endpoints: first.endpoints }, quiet), true);
  const good = currentGroupedTools();
  const goodTools = currentTools();

  // Same new param name with two types in one group: the actions can't merge.
  const broken = live();
  find(broken, '/facebook/pages/posts').queryParams.push({ name: 'foo', type: 'boolean', required: false, description: 'a' });
  find(broken, '/facebook/pages/videos').queryParams.push({ name: 'foo', type: 'string', required: false, description: 'a' });
  assert.throws(() => buildGroupedTools(applyCatalog(tools, broken, baseline).tools), /conflicting/);
  assert.equal(applyLiveCatalog({ version: 2, endpoints: broken.endpoints }, quiet), false);
  assert.equal(currentGroupedTools(), good);
  assert.equal(currentTools(), goodTools);
  assert.equal(catalogStatus().version, 1);
});

test('refreshCatalog: fetch failure and non-200 keep bundled; success goes live', async () => {
  await refreshCatalog({ url: 'http://x', fetchImpl: async () => { throw new Error('down'); }, log: () => {} });
  assert.equal(catalogStatus().source, 'bundled');
  await refreshCatalog({ url: 'http://x', fetchImpl: async () => ({ ok: false, status: 503 }), log: () => {} });
  assert.equal(catalogStatus().source, 'bundled');
  await refreshCatalog({ url: 'http://x', fetchImpl: async () => ({ ok: true, json: async () => ({ version: 7, endpoints: baseline.endpoints }) }), log: () => {} });
  assert.equal(catalogStatus().source, 'live');
  assert.deepEqual(currentGroupedTools(), groupedTools);
});
