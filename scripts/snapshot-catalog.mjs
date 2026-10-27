#!/usr/bin/env node
// Write src/catalogBaseline.json: the endpoint catalog that src/tools.js was
// written against. At runtime the server compares the live catalog with this
// baseline and only applies what changed since (prices, descriptions,
// parameters), so the hand-written tool text stays as long as nobody edits
// the endpoint.
//
// Re-run it whenever you update tools.js to match the API:
//   node scripts/snapshot-catalog.mjs --from https://auth.socialapis.io/api/public/endpoints
//   node scripts/snapshot-catalog.mjs --from ../api-scraping/src/config/endpoints.json
//
// Only public fields are written (src/publicCatalog.js): never upstream URLs,
// headers, timeouts or middlewares, even when reading endpoints.json.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { toPublicEndpoint } from '../src/publicCatalog.js';

const args = process.argv.slice(2);
const fromIdx = args.indexOf('--from');
const from = fromIdx >= 0 ? args[fromIdx + 1] : 'https://auth.socialapis.io/api/public/endpoints';
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'catalogBaseline.json');

const raw = /^https?:\/\//.test(from)
  ? await (await fetch(from, { signal: AbortSignal.timeout(10_000) })).json()
  : JSON.parse(await readFile(from, 'utf8'));

const list = Array.isArray(raw) ? raw : raw?.endpoints;
if (!Array.isArray(list) || !list.length) throw new Error(`No endpoints in ${from}`);

const endpoints = list
  .filter((e) => e && e.enabled !== false)
  .map(toPublicEndpoint)
  .sort((a, b) => (a.route === b.route ? a.method.localeCompare(b.method) : a.route.localeCompare(b.route)));

await writeFile(out, `${JSON.stringify({ endpoints }, null, 2)}\n`);
console.log(`Wrote ${endpoints.length} endpoints to ${path.relative(process.cwd(), out)}`);
