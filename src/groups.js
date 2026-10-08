// Groups the 47 per-endpoint tool definitions in tools.js into 12 MCP tools,
// one per resource, each taking an `action` argument. tools.js stays the
// source of truth for endpoints and parameters; this file only decides how
// they're presented. Fewer, broader tools keep the list under client limits
// (Cursor caps the total tool count) and make tool selection easier.
//
// The original 47 names stay callable (resolveCall) so existing configs,
// prompts and npm clients <= 1.2.x keep working. They're just not listed.

import { tools } from './tools.js';

export const GROUPS = [
  {
    name: 'facebook_page',
    summary: 'Facebook pages: profile details, page ID, posts, videos and reels.',
    actions: {
      details: 'facebook_get_page_details',
      id: 'facebook_get_page_id',
      posts: 'facebook_get_page_posts',
      videos: 'facebook_get_page_videos',
      reels: 'facebook_get_page_reels',
    },
  },
  {
    name: 'facebook_group',
    summary: 'Public Facebook groups: details, group ID, posts and videos.',
    actions: {
      details: 'facebook_get_group_details',
      id: 'facebook_get_group_id',
      posts: 'facebook_get_group_posts',
      videos: 'facebook_get_group_videos',
    },
  },
  {
    name: 'facebook_post',
    summary: 'Facebook posts, videos and comments: post details, attachments, comments and replies.',
    actions: {
      details: 'facebook_get_post_details',
      details_extended: 'facebook_get_post_details_extended',
      id: 'facebook_get_post_id',
      attachments: 'facebook_get_post_attachments',
      video: 'facebook_get_video_details',
      comments: 'facebook_get_post_comments',
      comment_replies: 'facebook_get_comment_replies',
    },
  },
  {
    name: 'facebook_search',
    summary: 'Search Facebook by keyword: pages, people, posts, videos and locations.',
    actions: {
      pages: 'facebook_search_pages',
      people: 'facebook_search_people',
      posts: 'facebook_search_posts',
      videos: 'facebook_search_videos',
      locations: 'facebook_search_locations',
    },
  },
  {
    name: 'facebook_ads',
    summary: 'Meta Ads Library: search ads, find advertisers by keyword, advertiser page details, single ad details and supported countries.',
    actions: {
      search: 'facebook_ads_search',
      keywords: 'facebook_ads_keywords',
      page_details: 'facebook_ads_page_details',
      archive_details: 'facebook_ads_archive_details',
      countries: 'facebook_ads_countries',
    },
  },
  {
    name: 'facebook_marketplace',
    summary: 'Facebook Marketplace: search listings, vehicles and rentals, listing and seller details, categories and city coordinates.',
    actions: {
      search: 'facebook_marketplace_search',
      vehicles: 'facebook_marketplace_vehicles',
      rentals: 'facebook_marketplace_rentals',
      listing: 'facebook_marketplace_listing',
      seller: 'facebook_marketplace_seller',
      categories: 'facebook_marketplace_categories',
      city_coordinates: 'facebook_marketplace_city_coordinates',
    },
  },
  {
    name: 'facebook_media_download',
    summary: 'Download Facebook media (images, videos, audio) from a URL.',
    actions: { download: 'facebook_download_media' },
  },
  {
    name: 'instagram_profile',
    summary: 'Instagram profiles: details, user ID, posts, reels, highlights and highlight stories.',
    actions: {
      details: 'instagram_get_profile_details',
      id: 'instagram_get_user_id',
      posts: 'instagram_get_profile_posts',
      reels: 'instagram_get_profile_reels',
      highlights: 'instagram_get_profile_highlights',
      highlight_details: 'instagram_get_highlight_details',
    },
  },
  {
    name: 'instagram_post',
    summary: 'Instagram posts: full post details, or the shortcode from a post URL.',
    actions: {
      details: 'instagram_get_post_details',
      id: 'instagram_get_post_id',
    },
  },
  {
    name: 'instagram_reels',
    summary: 'Instagram Reels: the trending feed, or reels that use a given audio track.',
    actions: {
      feed: 'instagram_get_reels_feed',
      by_audio: 'instagram_get_reels_by_audio',
    },
  },
  {
    name: 'instagram_search',
    summary: 'Search Instagram by keyword for popular users, hashtags and places.',
    actions: { search: 'instagram_popular_search' },
  },
  {
    name: 'instagram_location',
    summary: 'Instagram locations: posts tagged at a place, and nearby places.',
    actions: {
      posts: 'instagram_get_location_posts',
      nearby: 'instagram_get_nearby_locations',
    },
  },
];

const legacyByName = new Map(tools.map((t) => [t.name, t]));

// legacy tool name -> { group, action }
const legacyToGroup = new Map();
for (const group of GROUPS) {
  for (const [action, legacyName] of Object.entries(group.actions)) {
    if (!legacyByName.has(legacyName)) throw new Error(`groups.js: unknown tool ${legacyName}`);
    legacyToGroup.set(legacyName, { group: group.name, action });
  }
}
if (legacyToGroup.size !== tools.length) {
  const missing = tools.map((t) => t.name).filter((n) => !legacyToGroup.has(n));
  throw new Error(`groups.js: tools not assigned to a group: ${missing.join(', ')}`);
}

// Legacy descriptions point at sibling tools by their old names. Rewrite
// those references to the grouped form: "action=details" within the same
// group, "facebook_search (action=pages)" across groups. Longest names first
// so facebook_get_post_details_extended isn't matched as ..._details.
const legacyNames = [...legacyToGroup.keys()].sort((a, b) => b.length - a.length);
const legacyNamePattern = new RegExp(`\\b(${legacyNames.join('|')})\\b`, 'g');

function rewriteReferences(text, currentGroup) {
  return text.replace(legacyNamePattern, (name) => {
    const { group, action } = legacyToGroup.get(name);
    return group === currentGroup ? `action=${action}` : `${group} (action=${action})`;
  });
}

// When actions share a parameter with different numeric bounds (e.g. limit
// 3-9 for page posts, 6-12 for page videos), accept the union so no valid
// value is rejected by the client. Each action's own range stays in the
// parameter description, and the REST API enforces it.
function mergeSchemas(a, b, label) {
  const merged = { ...a };
  for (const [key, value] of Object.entries(b)) {
    if (!(key in merged)) merged[key] = value;
    else if (JSON.stringify(merged[key]) === JSON.stringify(value)) continue;
    else if (key === 'minimum') merged.minimum = Math.min(merged.minimum, value);
    else if (key === 'maximum') merged.maximum = Math.max(merged.maximum, value);
    else throw new Error(`groups.js: ${label} has conflicting "${key}" between actions`);
  }
  return merged;
}

// One plain description for parameters that several actions share but that
// tools.js words differently per action. Per-action differences that matter
// (ranges, what a query means) go on one compact line. Every shared
// parameter with more than one wording must have an entry here; the
// build fails otherwise, so new actions can't silently reintroduce the
// long "For x: … For y: …" text.
const SHARED_PARAM_TEXT = {
  'facebook_page.link': 'Facebook page URL, e.g. https://facebook.com/nike. For videos you can pass profile_id instead.',
  'facebook_page.limit': 'Results per call. posts: 3-9 (default 3) · videos: 6-12 (default 6).',
  'facebook_page.end_cursor': 'Pagination cursor from the previous response.',
  'facebook_post.link': 'Facebook post or reel URL (regular posts, video posts and reels).',
  'facebook_search.query': 'Search keyword. pages: a brand or business name · people: a name · posts, videos: words in the text · locations: a city, place or landmark.',
  'facebook_search.location_uid': 'Location UID from action=locations, to limit results to a place.',
  'facebook_ads.query': 'Keyword. search: words in the ads (or pass ad_page_id instead) · keywords: a topic to find advertisers for, e.g. running shoes.',
  'facebook_ads.page_id': 'Advertiser page ID: ad_page_id from facebook_page (action=details), or page_id from action=keywords.',
  'facebook_marketplace.sort_by': 'Sort order. vehicles: CREATION_TIME_DESCEND, PRICE_ASCEND, VEHICLE_MILEAGE_ASCEND, … · rentals: CREATION_TIME_DESCEND, PRICE_ASCEND, BEST_MATCH.',
  'instagram_profile.username': 'Instagram username, without the @. For posts it returns more results than user_id.',
  'instagram_profile.link': 'Instagram profile URL (alternative to username).',
  'instagram_profile.user_id': 'Numeric Instagram user ID, from action=id. For posts, an alternative to username.',
};

function usageSuffix(uses, order) {
  const byOrder = (a, b) => order.indexOf(a) - order.indexOf(b);
  const req = uses.filter((u) => u.required).flatMap((u) => u.actions).sort(byOrder);
  const opt = uses.filter((u) => !u.required).flatMap((u) => u.actions).sort(byOrder);
  const parts = [];
  if (req.length) parts.push(`Required for: ${req.join(', ')}.`);
  if (opt.length) parts.push(`Optional for: ${opt.join(', ')}.`);
  return parts.join(' ');
}

function buildGroupTool(group) {
  const entries = Object.entries(group.actions).map(([action, legacyName]) => [action, legacyByName.get(legacyName)]);
  const single = entries.length === 1;

  // Merge parameters. A parameter shared by several actions keeps one entry;
  // if its meaning differs between actions, each wording is kept and labelled.
  const params = new Map(); // name -> { schema, uses: [{ actions, description }] }
  for (const [action, tool] of entries) {
    for (const [pname, pschema] of Object.entries(tool.inputSchema.properties || {})) {
      const description = rewriteReferences(pschema.description || '', group.name);
      const { description: _omit, ...rest } = pschema;
      if (!params.has(pname)) params.set(pname, { schema: rest, uses: [] });
      const entry = params.get(pname);
      entry.schema = mergeSchemas(entry.schema, rest, `${group.name}.${pname}`);
      const required = (tool.inputSchema.required || []).includes(pname);
      const same = entry.uses.find((u) => u.description === description && u.required === required);
      if (same) same.actions.push(action);
      else entry.uses.push({ actions: [action], description, required });
    }
  }

  const properties = {};
  if (!single) {
    properties.action = {
      type: 'string',
      enum: entries.map(([action]) => action),
      description: 'Which operation to run. See the tool description for what each action returns and which parameters it needs.',
    };
  }
  const sentence = (text) => (/[.!?]$/.test(text) ? text : `${text}.`);
  for (const [pname, { schema, uses }] of params) {
    let description;
    if (single) {
      description = uses[0].description;
    } else {
      const wordings = new Set(uses.map((u) => u.description));
      const key = `${group.name}.${pname}`;
      let base;
      if (wordings.size === 1) base = sentence(uses[0].description);
      else if (SHARED_PARAM_TEXT[key]) base = SHARED_PARAM_TEXT[key];
      else throw new Error(`groups.js: ${key} has different wording per action; add it to SHARED_PARAM_TEXT`);
      description = `${base} ${usageSuffix(uses, Object.keys(group.actions))}`;
    }
    properties[pname] = { ...schema, description };
  }

  const actionLines = entries.map(([action, tool]) => {
    const required = tool.inputSchema.required || [];
    const optional = Object.keys(tool.inputSchema.properties || {}).filter((p) => !required.includes(p));
    const inputs = [
      ...required.map((p) => `${p} (required)`),
      ...optional.map((p) => `${p} (optional)`),
    ];
    const needs = inputs.length ? ` Inputs: ${inputs.join(', ')}.` : ' Inputs: none.';
    const text = rewriteReferences(tool.description, group.name);
    return single ? `${text}${needs}` : `- action=${action}: ${text}${needs}`;
  });

  const description = single
    ? actionLines[0]
    : `${group.summary}\n\nActions:\n${actionLines.join('\n')}`;

  return {
    name: group.name,
    description,
    inputSchema: {
      type: 'object',
      properties,
      required: single ? (entries[0][1].inputSchema.required || []) : ['action'],
    },
  };
}

/** The 12 grouped tool definitions (name, description, inputSchema). */
export const groupedTools = GROUPS.map(buildGroupTool);

/**
 * Resolve a tool call to the underlying endpoint tool.
 * Accepts a grouped name with an `action` argument, or a legacy tool name.
 *
 * @returns {{ tool: object, args: object } | { error: string }}
 */
export function resolveCall(name, args = {}) {
  const legacy = legacyByName.get(name);
  if (legacy) return { tool: legacy, args };

  const group = GROUPS.find((g) => g.name === name);
  if (!group) {
    return { error: `Unknown tool: ${name}. Available tools: ${GROUPS.map((g) => g.name).join(', ')}` };
  }

  const actionNames = Object.keys(group.actions);
  const { action, ...rest } = args || {};
  const chosen = actionNames.length === 1 ? actionNames[0] : action;
  if (!chosen) {
    return { error: `${name} needs an "action" argument. One of: ${actionNames.join(', ')}.` };
  }
  const legacyName = group.actions[chosen];
  if (!legacyName) {
    return { error: `Unknown action "${chosen}" for ${name}. One of: ${actionNames.join(', ')}.` };
  }

  const tool = legacyByName.get(legacyName);
  const missing = (tool.inputSchema.required || []).filter((p) => rest[p] === undefined || rest[p] === null || rest[p] === '');
  if (missing.length) {
    return { error: `${name} action=${chosen} requires: ${missing.join(', ')}.` };
  }
  return { tool, args: rest };
}
