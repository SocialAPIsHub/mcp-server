export const tools = [
  // ===========================================
  // FACEBOOK — Pages
  // ===========================================
  {
    name: 'facebook_get_page_id',
    description: 'Get Facebook page ID from a page URL',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook page URL (e.g., https://facebook.com/nike)' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/pages/id',
    method: 'GET',
  },
  {
    name: 'facebook_get_page_details',
    description: 'Get detailed information about a Facebook page including followers, likes, contact info, and category',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook page URL' },
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
        link: { type: 'string', description: 'Facebook page URL' },
        end_cursor: { type: 'string', description: 'Pagination cursor for next page of results' },
        after_time: { type: 'string', description: 'ISO 8601 timestamp - only return posts after this time' },
        before_time: { type: 'string', description: 'ISO 8601 timestamp - only return posts before this time' },
        timezone: { type: 'string', description: 'Timezone for timestamps (e.g., UTC, America/New_York)' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/pages/posts',
    method: 'GET',
  },
  {
    name: 'facebook_get_page_videos',
    description: 'Get videos from a Facebook page (up to 6 per request) with pagination',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook page URL' },
        profile_id: { type: 'string', description: 'Facebook profile ID (alternative to link)' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: [],
    },
    endpoint: '/facebook/pages/videos',
    method: 'GET',
  },
  {
    name: 'facebook_get_page_reels',
    description: 'Get reels/short videos from a Facebook page',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook page URL' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/pages/reels',
    method: 'GET',
  },

  // ===========================================
  // FACEBOOK — Groups
  // ===========================================
  {
    name: 'facebook_get_group_id',
    description: 'Get Facebook group ID from a group URL',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook group URL' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/groups/id',
    method: 'GET',
  },
  {
    name: 'facebook_get_group_metadata',
    description: 'Get group metadata (name, id, url, cover image)',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook group URL' },
        group_id: { type: 'string', description: 'Facebook Group ID (alternative to link)' },
      },
      required: [],
    },
    endpoint: '/facebook/groups/metadata',
    method: 'GET',
  },
  {
    name: 'facebook_get_group_details',
    description: 'Get detailed metadata about a Facebook group including member count, description, rules, and activity stats',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook group URL' },
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
        link: { type: 'string', description: 'Facebook group URL' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
        after_time: { type: 'string', description: 'ISO 8601 timestamp' },
        before_time: { type: 'string', description: 'ISO 8601 timestamp' },
        timezone: { type: 'string', description: 'Timezone' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/groups/posts',
    method: 'GET',
  },
  {
    name: 'facebook_get_group_videos',
    description: 'Get videos from a Facebook group (up to 6 per request) with pagination',
    inputSchema: {
      type: 'object',
      properties: {
        group_id: { type: 'string', description: 'Facebook Group ID' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: [],
    },
    endpoint: '/facebook/groups/videos',
    method: 'GET',
  },

  // ===========================================
  // FACEBOOK — Posts
  // ===========================================
  {
    name: 'facebook_get_post_id',
    description: 'Extract Facebook post ID from a post URL',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook post URL' },
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
        link: { type: 'string', description: 'Facebook post URL' },
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
        post_id: { type: 'string', description: 'Facebook post ID' },
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
        video_id: { type: 'string', description: 'Facebook video ID' },
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
        link: { type: 'string', description: 'Facebook post or reel URL' },
        end_cursor: { type: 'string', description: 'Pagination cursor for next page of comments' },
        include_reply_info: { type: 'string', description: 'When "true", includes comment_feedback_id and expansion_token for fetching replies' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/posts/comments',
    method: 'GET',
  },
  {
    name: 'facebook_get_comment_replies',
    description: 'Fetch replies to a specific comment on a Facebook post',
    inputSchema: {
      type: 'object',
      properties: {
        comment_feedback_id: { type: 'string', description: 'Feedback ID from the comments endpoint with include_reply_info=true' },
        expansion_token: { type: 'string', description: 'Expansion token from the comments endpoint with include_reply_info=true' },
      },
      required: ['comment_feedback_id', 'expansion_token'],
    },
    endpoint: '/facebook/posts/comments/replies',
    method: 'GET',
  },

  // ===========================================
  // FACEBOOK — Search
  // ===========================================
  {
    name: 'facebook_search_pages',
    description: 'Search for Facebook pages by keyword with optional location filtering',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        location_uid: { type: 'string', description: 'Location UID for filtering (from search/locations endpoint)' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: ['query'],
    },
    endpoint: '/facebook/search/pages',
    method: 'GET',
  },
  {
    name: 'facebook_search_people',
    description: 'Search for Facebook people/profiles by keyword with optional location filtering',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        location_uid: { type: 'string', description: 'Location UID for filtering' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: ['query'],
    },
    endpoint: '/facebook/search/people',
    method: 'GET',
  },
  {
    name: 'facebook_search_locations',
    description: 'Search for Facebook locations by keyword. Returns UIDs for geo-filtering other search endpoints.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (city, place, landmark)' },
      },
      required: ['query'],
    },
    endpoint: '/facebook/search/locations',
    method: 'GET',
  },
  {
    name: 'facebook_search_posts',
    description: 'Search for Facebook posts by keyword with optional location and time filters',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        location_uid: { type: 'string', description: 'Location UID for filtering' },
        start_time: { type: 'string', description: 'Filter posts after this date (YYYY-MM-DD)' },
        end_time: { type: 'string', description: 'Filter posts before this date (YYYY-MM-DD)' },
        recent_posts: { type: 'string', description: 'When "true", shows only recent posts' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: ['query'],
    },
    endpoint: '/facebook/search/posts',
    method: 'GET',
  },
  {
    name: 'facebook_search_videos',
    description: 'Search for Facebook videos by keyword with optional recency and live filters',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        most_recent: { type: 'string', description: 'When "true", shows most recent videos first' },
        videos_live: { type: 'string', description: 'When "true", filters for live videos only' },
        fields: { type: 'string', description: 'Comma-separated list of response fields to include' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: ['query'],
    },
    endpoint: '/facebook/search/videos',
    method: 'GET',
  },

  // ===========================================
  // FACEBOOK — Meta Ads Library
  // ===========================================
  {
    name: 'facebook_ads_search',
    description: 'Search ads in the Meta Ad Library by keyword or page ID with country, status, and date filters',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keyword for ads' },
        ad_page_id: { type: 'string', description: 'Facebook AD Page ID (alternative to query)' },
        country: { type: 'string', description: 'ISO country code or "ALL"' },
        activeStatus: { type: 'string', description: 'Filter: ALL, Active, or Inactive' },
        after_time: { type: 'string', description: 'Filter ads after this date (YYYY-MM-DD)' },
        before_time: { type: 'string', description: 'Filter ads before this date (YYYY-MM-DD)' },
        sort_data: { type: 'string', description: 'Sort by "impressions" or "recent"' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: [],
    },
    endpoint: '/facebook/ads/search',
    method: 'GET',
  },
  {
    name: 'facebook_ads_page_details',
    description: 'Get detailed info about a specific Facebook page from the Ads Library',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: { type: 'string', description: 'Facebook Page ID' },
      },
      required: ['page_id'],
    },
    endpoint: '/facebook/ads/page-details',
    method: 'GET',
  },
  {
    name: 'facebook_ads_archive_details',
    description: 'Get detailed info about a specific archived ad including creative, spend, and impressions',
    inputSchema: {
      type: 'object',
      properties: {
        ad_archive_id: { type: 'string', description: 'Ad Archive ID' },
        page_id: { type: 'string', description: 'Facebook Page ID' },
        country: { type: 'string', description: 'ISO country code or "ALL"' },
        is_ad_non_political: { type: 'string', description: 'Filter non-political ads' },
        is_ad_not_aaa_eligible: { type: 'string', description: 'Filter AAA eligibility' },
      },
      required: ['ad_archive_id'],
    },
    endpoint: '/facebook/ads/archive-details',
    method: 'GET',
  },
  {
    name: 'facebook_ads_keywords',
    description: 'Search for ads by keyword with optional country filter',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keyword' },
        country: { type: 'string', description: 'ISO country code or "ALL"' },
      },
      required: ['query'],
    },
    endpoint: '/facebook/ads/keywords',
    method: 'GET',
  },
  {
    name: 'facebook_ads_countries',
    description: 'Get list of supported country codes for Meta Ads Library filtering',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    endpoint: '/facebook/ads/countries',
    method: 'GET',
  },

  // ===========================================
  // FACEBOOK — Marketplace
  // ===========================================
  {
    name: 'facebook_marketplace_search',
    description: 'Search Facebook Marketplace items with filters for location, price, category, condition, and sort order',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term' },
        category_url: { type: 'string', description: 'Category URL slug' },
        commerce_search_sort_by: { type: 'string', description: 'Sort: BEST_MATCH, CREATION_TIME_DESCEND, PRICE_ASCEND, etc.' },
        commerce_search_and_rp_condition: { type: 'string', description: 'Condition: new, used_like_new, used_good, used_fair' },
        filter_location_latitude: { type: 'string', description: 'GPS latitude' },
        filter_location_longitude: { type: 'string', description: 'GPS longitude' },
        filter_price_lower_bound: { type: 'string', description: 'Minimum price' },
        filter_price_upper_bound: { type: 'string', description: 'Maximum price' },
        filter_radius_km: { type: 'string', description: 'Radius in km' },
        posted_today: { type: 'string', description: 'When "true", limit to items posted today' },
        exact_match: { type: 'string', description: 'When "true", exact match search' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: [],
    },
    endpoint: '/facebook/marketplace/search',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_listing',
    description: 'Get detailed info about a single Marketplace listing',
    inputSchema: {
      type: 'object',
      properties: {
        listing_id: { type: 'string', description: 'Marketplace Listing ID' },
      },
      required: ['listing_id'],
    },
    endpoint: '/facebook/marketplace/listing',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_seller',
    description: 'Get seller profile, ratings, reviews, and badges',
    inputSchema: {
      type: 'object',
      properties: {
        seller_id: { type: 'string', description: 'Seller ID' },
      },
      required: ['seller_id'],
    },
    endpoint: '/facebook/marketplace/seller',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_categories',
    description: 'Get all Marketplace categories with SEO URLs and category IDs',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
    endpoint: '/facebook/marketplace/categories',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_city_coordinates',
    description: 'Get GPS coordinates for a city to use as Marketplace location filters',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name' },
        country: { type: 'string', description: 'Country name or code' },
        exactly_one: { type: 'string', description: 'When "true", return exactly one result' },
      },
      required: ['city'],
    },
    endpoint: '/facebook/marketplace/city-coordinates',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_vehicles',
    description: 'Search Marketplace vehicle listings with filters for location, price, mileage, year',
    inputSchema: {
      type: 'object',
      properties: {
        sort_by: { type: 'string', description: 'Sort: CREATION_TIME_DESCEND, PRICE_ASCEND, VEHICLE_MILEAGE_ASCEND, etc.' },
        filter_location_latitude: { type: 'string', description: 'GPS latitude' },
        filter_location_longitude: { type: 'string', description: 'GPS longitude' },
        filter_price_lower_bound: { type: 'string', description: 'Minimum price' },
        filter_price_upper_bound: { type: 'string', description: 'Maximum price' },
        filter_radius_km: { type: 'string', description: 'Radius in km' },
        is_c2c_listing_only: { type: 'string', description: 'Individual sellers only' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: [],
    },
    endpoint: '/facebook/marketplace/vehicles',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_rentals',
    description: 'Search Marketplace rental property listings with filters for bedrooms, bathrooms, location, price',
    inputSchema: {
      type: 'object',
      properties: {
        sort_by: { type: 'string', description: 'Sort: CREATION_TIME_DESCEND, PRICE_ASCEND, BEST_MATCH' },
        filter_location_latitude: { type: 'string', description: 'GPS latitude' },
        filter_location_longitude: { type: 'string', description: 'GPS longitude' },
        filter_price_lower_bound: { type: 'string', description: 'Minimum price' },
        filter_price_upper_bound: { type: 'string', description: 'Maximum price' },
        filter_radius_km: { type: 'string', description: 'Radius in km' },
        filter_bedrooms_min: { type: 'string', description: 'Min bedrooms' },
        filter_bedrooms_max: { type: 'string', description: 'Max bedrooms' },
        filter_bathrooms_min: { type: 'string', description: 'Min bathrooms' },
        filter_bathrooms_max: { type: 'string', description: 'Max bathrooms' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: [],
    },
    endpoint: '/facebook/marketplace/rentals',
    method: 'GET',
  },

  // ===========================================
  // FACEBOOK — Media
  // ===========================================
  {
    name: 'facebook_download_media',
    description: 'Download images, videos, and audio from Facebook URLs',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Facebook media URL to download' },
      },
      required: ['url'],
    },
    endpoint: '/facebook/media/download',
    method: 'GET',
  },

  // ===========================================
  // INSTAGRAM — Profiles
  // ===========================================
  {
    name: 'instagram_get_user_id',
    description: 'Get the unique ID of any Instagram profile from a link or username',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Instagram profile URL' },
        username: { type: 'string', description: 'Instagram username' },
      },
      required: [],
    },
    endpoint: '/instagram/user/id',
    method: 'GET',
  },
  {
    name: 'instagram_get_profile_details',
    description: 'Get user profile information by username including bio, followers, posts count, verification, and related profiles',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Instagram username' },
        link: { type: 'string', description: 'Instagram profile URL (alternative to username)' },
      },
      required: ['username'],
    },
    endpoint: '/instagram/profile/details',
    method: 'GET',
  },
  {
    name: 'instagram_get_profile_posts',
    description: 'Get posts from a user profile with pagination. Returns photos, videos, carousels with engagement metrics.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'Instagram user ID (get from user/id endpoint)' },
        end_cursor: { type: 'string', description: 'Pagination cursor for next page' },
      },
      required: ['user_id'],
    },
    endpoint: '/instagram/profile/posts',
    method: 'GET',
  },
  {
    name: 'instagram_get_profile_reels',
    description: 'Get reels from a user profile with pagination. Returns video details, play counts, and audio metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'Instagram user ID' },
        end_cursor: { type: 'string', description: 'Pagination cursor for next page' },
      },
      required: ['user_id'],
    },
    endpoint: '/instagram/profile/reels',
    method: 'GET',
  },
  {
    name: 'instagram_get_profile_highlights',
    description: 'Get all highlights from a user profile including cover images, titles, and permalink URLs',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'Instagram user ID' },
      },
      required: ['user_id'],
    },
    endpoint: '/instagram/profile/highlights',
    method: 'GET',
  },
  {
    name: 'instagram_get_highlight_details',
    description: 'Get details of a specific highlight by ID including all stories within the highlight',
    inputSchema: {
      type: 'object',
      properties: {
        highlight_id: { type: 'string', description: 'Highlight ID (from profile highlights endpoint)' },
      },
      required: ['highlight_id'],
    },
    endpoint: '/instagram/highlight/details',
    method: 'GET',
  },

  // ===========================================
  // INSTAGRAM — Posts
  // ===========================================
  {
    name: 'instagram_get_post_id',
    description: 'Extract the post shortcode/ID from any Instagram post URL',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Instagram post URL' },
      },
      required: ['link'],
    },
    endpoint: '/instagram/post/id',
    method: 'GET',
  },
  {
    name: 'instagram_get_post_details',
    description: 'Get full details of a specific Instagram post including media, engagement, caption, and owner info',
    inputSchema: {
      type: 'object',
      properties: {
        shortcode: { type: 'string', description: 'Instagram post shortcode (e.g., DMF-GjGO0-q)' },
      },
      required: ['shortcode'],
    },
    endpoint: '/instagram/post/details',
    method: 'GET',
  },

  // ===========================================
  // INSTAGRAM — Reels
  // ===========================================
  {
    name: 'instagram_get_reels_feed',
    description: 'Get Instagram Reels feed with recommended, trending, or same-author chained clips',
    inputSchema: {
      type: 'object',
      properties: {
        clips_media_id: { type: 'string', description: 'Clip media ID for chaining/pagination (from previous response)' },
      },
      required: [],
    },
    endpoint: '/instagram/reels/feed',
    method: 'GET',
  },
  {
    name: 'instagram_get_reels_by_audio',
    description: 'Get Instagram Reels associated with a specific audio/music ID. Find all reels using a particular sound.',
    inputSchema: {
      type: 'object',
      properties: {
        audio_id: { type: 'string', description: 'Audio cluster ID (music ID)' },
        max_id: { type: 'string', description: 'Pagination cursor for next page' },
      },
      required: ['audio_id'],
    },
    endpoint: '/instagram/reels/audio',
    method: 'GET',
  },

  // ===========================================
  // INSTAGRAM — Search & Locations
  // ===========================================
  {
    name: 'instagram_popular_search',
    description: 'Search Instagram by keyword and get popular results including users, hashtags, and places',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: 'Search keyword/query' },
        end_cursor: { type: 'string', description: 'Pagination cursor for next page' },
      },
      required: ['keyword'],
    },
    endpoint: '/instagram/search',
    method: 'GET',
  },
  {
    name: 'instagram_get_location_posts',
    description: 'Get Instagram posts from a specific location. Retrieve top/ranked or most recent posts tagged at a place.',
    inputSchema: {
      type: 'object',
      properties: {
        location_id: { type: 'string', description: 'Instagram location ID' },
        tab: { type: 'string', description: 'Filter: "recent" or "ranked"' },
        end_cursor: { type: 'string', description: 'Pagination cursor for next page' },
      },
      required: ['location_id'],
    },
    endpoint: '/instagram/location/posts',
    method: 'GET',
  },
  {
    name: 'instagram_get_nearby_locations',
    description: 'Get nearby places/locations for a specific Instagram location including name, category, coordinates, and post count',
    inputSchema: {
      type: 'object',
      properties: {
        location_id: { type: 'string', description: 'Instagram location ID' },
      },
      required: ['location_id'],
    },
    endpoint: '/instagram/location/nearby',
    method: 'GET',
  },
];