// Keeps the tool definitions in step with the live SocialAPIs endpoint
// catalog (prices, descriptions, parameters edited in the SocialAPIs admin),
// without a release.
//
//   SOCIALAPIS_CATALOG_URL         default https://auth.socialapis.io/api/public/endpoints
//   SOCIALAPIS_CATALOG_REFRESH_MS  default 600000 (10 min)
//   SOCIALAPIS_LIVE_CATALOG=0      off: always the bundled tools.js
//
// Fetched once at startup (3s timeout, never blocks longer) and then on a
// timer. A failed fetch, a bad response or definitions that no longer group
// cleanly keep the last good set; before the first success that's the
// bundled tools.js. Tool, group and action names never change.

import { readFileSync } from 'node:fs';
import { tools as bundledTools } from './tools.js';
import { buildGroupedTools, groupedTools as bundledGrouped } from './groups.js';
import { applyCatalog } from './catalogOverlay.js';
import { isCatalog, toPublicEndpoint } from './publicCatalog.js';

const baseline = JSON.parse(readFileSync(new URL('./catalogBaseline.json', import.meta.url), 'utf8'));

const DEFAULT_URL = 'https://auth.socialapis.io/api/public/endpoints';
const FETCH_TIMEOUT_MS = 3000;

const state = {
  tools: bundledTools,
  groupedTools: bundledGrouped,
  source: 'bundled',
  version: null,
  fetchedAt: null,
  lastError: null,
  changes: [],
  routes: 0,
};
const listeners = new Set();

export const currentTools = () => state.tools;
export const currentGroupedTools = () => state.groupedTools;

/**
 * Status for /health: source (live | bundled), catalog version, when it was
 * fetched, and how many tools the live catalog covered (0 when bundled).
 * No URLs, no secrets.
 */
export const catalogStatus = () => ({
  source: state.source,
  version: state.version,
  fetchedAt: state.fetchedAt,
  routes: state.source === 'live' ? state.routes : 0,
});

/** Changes applied by the last live catalog (for logs and tests). */
export const catalogChanges = () => [...state.changes];

/** Called with no arguments after the tool definitions changed. */
export function onToolsChanged(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Apply one catalog response. Exported for tests. Returns true if the
 * definitions changed. Never throws.
 */
export function applyLiveCatalog(data, { log = console.error } = {}) {
  try {
    if (!isCatalog(data)) throw new Error('unexpected catalog response');
    const live = { endpoints: data.endpoints.map(toPublicEndpoint) };
    const { tools, changes, unmapped, matched } = applyCatalog(bundledTools, live, baseline);
    const grouped = buildGroupedTools(tools);
    const changed = JSON.stringify(grouped) !== JSON.stringify(state.groupedTools);
    Object.assign(state, {
      tools,
      groupedTools: grouped,
      source: 'live',
      version: Number.isFinite(data.version) ? data.version : null,
      fetchedAt: new Date().toISOString(),
      lastError: null,
      changes,
      routes: matched,
    });
    if (changed) {
      log(`[catalog] live v${state.version ?? '?'}: ${changes.length ? changes.join(', ') : 'same as bundled'}`);
      if (unmapped.length) log(`[catalog] endpoints with no MCP tool yet: ${unmapped.join(', ')}`);
      for (const fn of listeners) {
        try { fn(); } catch { /* listener errors never break the refresh */ }
      }
    }
    return changed;
  } catch (error) {
    state.lastError = error.message;
    log(`[catalog] keeping the ${state.source} definitions: ${error.message}`);
    return false;
  }
}

/** Fetch and apply the live catalog once. Never throws. */
export async function refreshCatalog({ url = process.env.SOCIALAPIS_CATALOG_URL || DEFAULT_URL, fetchImpl = fetch, log = console.error } = {}) {
  try {
    const res = await fetchImpl(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return applyLiveCatalog(await res.json(), { log });
  } catch (error) {
    state.lastError = error.message;
    log(`[catalog] fetch failed, keeping the ${state.source} definitions: ${error.message}`);
    return false;
  }
}

let timer = null;

/**
 * Start following the live catalog: one fetch now (awaited, at most ~3s),
 * then every SOCIALAPIS_CATALOG_REFRESH_MS. The timer doesn't keep the
 * process alive.
 */
export async function startLiveCatalog(opts = {}) {
  if (process.env.SOCIALAPIS_LIVE_CATALOG === '0') return catalogStatus();
  await refreshCatalog(opts);
  const every = Number(process.env.SOCIALAPIS_CATALOG_REFRESH_MS) || 600_000;
  if (!timer) {
    timer = setInterval(() => { refreshCatalog(opts); }, Math.max(every, 30_000));
    timer.unref?.();
  }
  return catalogStatus();
}

/** Test-only: back to the bundled definitions, timer stopped. */
export function _resetForTest() {
  if (timer) clearInterval(timer);
  timer = null;
  listeners.clear();
  Object.assign(state, { tools: bundledTools, groupedTools: bundledGrouped, source: 'bundled', version: null, fetchedAt: null, lastError: null, changes: [], routes: 0 });
}
