export const tools = [
  {
    name: 'facebook_get_page_id',
    description: 'Get Facebook page ID from a page URL',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook page URL (e.g., https://facebook.com/nike)',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/pages/id',
    method: 'GET',
  },
  {
    name: 'facebook_get_page_details',
    description: 'Get detailed information about a Facebook page including followers, likes, and posts',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook page URL',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/pages/details',
    method: 'GET',
  },
  {
    name: 'facebook_get_page_posts',
    description: 'Get recent posts from a Facebook page with optional pagination and time filtering',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook page URL',
        },
        end_cursor: {
          type: 'string',
          description: 'Pagination cursor for next page of results',
        },
        after_time: {
          type: 'string',
          description: 'ISO 8601 timestamp - only return posts after this time',
        },
        before_time: {
          type: 'string',
          description: 'ISO 8601 timestamp - only return posts before this time',
        },
        timezone: {
          type: 'string',
          description: 'Timezone for timestamps (e.g., UTC, America/New_York)',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/pages/posts',
    method: 'GET',
  },
  {
    name: 'facebook_get_page_reels',
    description: 'Get reels/short videos from a Facebook page',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook page URL',
        },
        end_cursor: {
          type: 'string',
          description: 'Pagination cursor',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/pages/reels',
    method: 'GET',
  },
  {
    name: 'facebook_get_group_id',
    description: 'Get Facebook group ID from a group URL',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook group URL',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/groups/id',
    method: 'GET',
  },
  {
    name: 'facebook_get_group_details',
    description: 'Get detailed metadata about a Facebook group including member count, description, and rules',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook group URL',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/groups/details',
    method: 'GET',
  },
  {
    name: 'facebook_get_group_posts',
    description: 'Fetch recent posts from a Facebook group with pagination and time filtering',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook group URL',
        },
        end_cursor: {
          type: 'string',
          description: 'Pagination cursor',
        },
        after_time: {
          type: 'string',
          description: 'ISO 8601 timestamp',
        },
        before_time: {
          type: 'string',
          description: 'ISO 8601 timestamp',
        },
        timezone: {
          type: 'string',
          description: 'Timezone',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/groups/posts',
    method: 'GET',
  },
  {
    name: 'facebook_get_post_id',
    description: 'Extract Facebook post ID from a post URL',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook post URL',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/posts/id',
    method: 'GET',
  },
  {
    name: 'facebook_get_post_details',
    description: 'Get detailed data about a Facebook post including reactions, comments, shares, and media',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook post URL',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/posts/details',
    method: 'GET',
  },
  {
    name: 'facebook_get_post_attachments',
    description: 'Get all media attachments (images, videos) from a Facebook post',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: {
          type: 'string',
          description: 'Facebook post ID',
        },
      },
      required: ['post_id'],
    },
    endpoint: '/facebook/posts/attachments',
    method: 'GET',
  },
  {
    name: 'facebook_get_video_details',
    description: 'Get video metadata, stats, and context for a Facebook video post',
    inputSchema: {
      type: 'object',
      properties: {
        video_id: {
          type: 'string',
          description: 'Facebook video ID',
        },
      },
      required: ['video_id'],
    },
    endpoint: '/facebook/posts/video',
    method: 'GET',
  },
  {
    name: 'facebook_get_post_comments',
    description: 'Retrieve top-level comments from a Facebook post or reel with pagination',
    inputSchema: {
      type: 'object',
      properties: {
        link: {
          type: 'string',
          description: 'Facebook post or reel URL',
        },
        end_cursor: {
          type: 'string',
          description: 'Pagination cursor for next page of comments',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/posts/comments',
    method: 'GET',
  },
];