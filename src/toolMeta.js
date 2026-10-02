// Shared MCP metadata for SocialAPIs tools: human-readable titles, behavior
// annotations, a common output schema, and the structured-result builder.
// Used by the hosted /mcp endpoint (server.js) and the npm stdio client
// (mcp-wrapper.js) so both expose identical tool definitions.

export const SERVER_IDENTITY = {
  name: 'socialapis-mcp',
  title: 'SocialAPIs',
  description: 'Facebook & Instagram data for AI agents: pages, posts, groups, Ads Library, Marketplace, profiles and reels.',
  websiteUrl: 'https://socialapis.io',
  icons: [{ src: 'https://socialapis.io/logo.png', mimeType: 'image/png', sizes: ['512x512'] }],
};

// Every SocialAPIs tool reads public data from the web and changes nothing,
// so they all share the same hints. idempotentHint is left unset: repeated
// calls have no side effects on the data, but each one does consume credits.
const ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  openWorldHint: true,
};

// One schema for all tools. `result` is the REST endpoint's JSON body as-is
// (object or array, so it is left untyped); the credit fields are lifted out
// of its `meta` block so agents can track spend without parsing each shape.
export const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    result: {
      description: 'JSON response from the SocialAPIs REST endpoint, unchanged. Object or array depending on the endpoint; most include a `meta` block (statusCode, duration, creditsCharged, creditsRemaining).',
    },
    creditsCharged: {
      type: ['integer', 'null'],
      description: 'Credits charged for this call, or null if the endpoint did not report it.',
    },
    creditsRemaining: {
      type: ['integer', 'null'],
      description: 'Credits left on the API key after this call, or null if not reported.',
    },
  },
  required: ['result'],
};

const WORD_OVERRIDES = { id: 'ID', ids: 'IDs', url: 'URL', api: 'API', by: 'by' };

/** facebook_get_page_details → "Facebook: Get Page Details" */
export function toolTitle(name) {
  const [platform, ...rest] = name.split('_');
  const word = (w) => WORD_OVERRIDES[w] || w.charAt(0).toUpperCase() + w.slice(1);
  return `${word(platform)}: ${rest.map(word).join(' ')}`;
}

/** Full MCP tool definition for one entry from src/tools.js. */
export function enrichTool(tool) {
  const title = toolTitle(tool.name);
  return {
    name: tool.name,
    title,
    description: tool.description,
    inputSchema: tool.inputSchema,
    outputSchema: OUTPUT_SCHEMA,
    annotations: { title, ...ANNOTATIONS },
  };
}

const intOrNull = (v) => (Number.isInteger(v) ? v : null);

/** structuredContent matching OUTPUT_SCHEMA for a successful backend response. */
export function buildStructuredResult(data) {
  const meta = data && !Array.isArray(data) && typeof data === 'object' ? data.meta : undefined;
  return {
    result: data ?? null,
    creditsCharged: intOrNull(meta?.creditsCharged),
    creditsRemaining: intOrNull(meta?.creditsRemaining),
  };
}
