export const tools = [
  // ===========================================
  // FACEBOOK — Pages
  // ===========================================
  {
    name: 'facebook_get_page_id',
    description: 'Resolve a Facebook page URL to its numeric page ID. Use it when another tool needs a page or profile ID; use facebook_get_page_details for the page\'s data. Pricing: 1 credit per call.',
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
    description: 'Get a Facebook page\'s profile: name, category, follower and like counts, bio, contact info (email, phone, website, address), rating and the ad_page_id used by the Ads Library tools. Use it when you have the page URL; to find a page by name, use facebook_search_pages first. Pricing: 1 credit per call; 5 credits when exact_followers_count=true.',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook page URL' },
        exact_followers_count: {
          type: 'boolean',
          description: 'When true, performs a deeper scrape to return the exact follower count (e.g. 38,493,217 instead of "38M"). Charges 5 credits when true, 1 credit otherwise. Default: false.',
        },
      },
      required: ['link'],
    },
    endpoint: '/facebook/pages/details',
    method: 'GET',
  },
  {
    name: 'facebook_get_page_posts',
    description: 'List a Facebook page\'s recent posts, newest first, with text, media, reactions, comment and share counts. Returns 3-9 posts per call plus an end_cursor for the next page; filter by date with after_time / before_time. For reels or videos only, use facebook_get_page_reels or facebook_get_page_videos. Pricing: ceil(posts_returned / 3) credits per call, minimum 1.',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook page URL' },
        limit: {
          type: 'number',
          description: 'Maximum number of posts to return. Default: 3. Minimum: 3. Maximum: 9.',
          minimum: 3,
          maximum: 9,
        },
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
    description: 'List videos uploaded to a Facebook page, with video_id, title, duration, view count and thumbnail. Provide the page URL (link) or its numeric profile_id. Returns an end_cursor for the next page. For short-form reels, use facebook_get_page_reels. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook page URL' },
        profile_id: { type: 'string', description: 'Facebook profile ID (alternative to link)' },
        limit: {
          type: 'number',
          description: 'Maximum number of videos to return. Default: 6. Minimum: 6. Maximum: 12.',
          minimum: 6,
          maximum: 12,
        },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: [],
    },
    endpoint: '/facebook/pages/videos',
    method: 'GET',
  },
  {
    name: 'facebook_get_page_reels',
    description: 'List a Facebook page\'s reels (short-form videos). Returns an end_cursor for the next page. For long-form videos, use facebook_get_page_videos. Pricing: 1 credit per call.',
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
    description: 'Resolve a Facebook group URL to its numeric group ID. Use facebook_get_group_details for the group\'s data. Pricing: 1 credit per call.',
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
    name: 'facebook_get_group_details',
    description: 'Get a public Facebook group\'s profile: name, description, member count, privacy, rules and activity stats. Use facebook_get_group_posts for its posts. Pricing: 1 credit per call.',
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
    description: 'List recent posts from a public Facebook group, with text, media, author, reactions and comment counts. Returns 3-9 posts per call plus an end_cursor for the next page; filter by date with after_time / before_time. Pricing: ceil(posts_returned / 3) credits per call, minimum 1.',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook group URL' },
        limit: {
          type: 'number',
          description: 'Maximum number of posts to return. Default: 3. Minimum: 3. Maximum: 9.',
          minimum: 3,
          maximum: 9,
        },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
        after_time: { type: 'string', description: 'ISO 8601 timestamp' },
        before_time: { type: 'string', description: 'ISO 8601 timestamp' },
        timezone: { type: 'string', description: 'IANA timezone for returned timestamps, e.g. UTC or America/New_York. Default: UTC.' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/groups/posts',
    method: 'GET',
  },
  {
    name: 'facebook_get_group_videos',
    description: 'List videos posted in a public Facebook group, with video_id, title, duration, view count and thumbnail. Returns an end_cursor for the next page. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook group URL' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/groups/videos',
    method: 'GET',
  },

  // ===========================================
  // FACEBOOK — Posts
  // ===========================================
  {
    name: 'facebook_get_post_id',
    description: 'Extract the numeric post ID from a Facebook post URL. Use it to get the post_id that facebook_get_post_attachments needs. Pricing: 1 credit per call.',
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
    description: 'Get a Facebook post\'s text, author, timestamp, media, and reaction, comment and share counts. Start here for any post. If you need view counts, video download URLs or audio metadata (common for reels and videos), use facebook_get_post_details_extended instead. Pricing: 1 credit per call.',
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
    name: 'facebook_get_post_details_extended',
    description: 'Get everything facebook_get_post_details returns plus view counts, HD/SD video URLs, music/audio metadata and author verification status. Use it for reels and video posts, or when the standard details lack view_count, video_hd_src or attached_track. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook post URL (works for reels, video posts, and regular posts)' },
      },
      required: ['link'],
    },
    endpoint: '/facebook/posts/details/extended',
    method: 'GET',
  },
  {
    name: 'facebook_get_post_attachments',
    description: 'List every media attachment (images and videos, with URLs and dimensions) on a Facebook post, including all items in multi-photo posts. Needs the numeric post_id from facebook_get_post_id. For the post\'s text and engagement, use facebook_get_post_details. Pricing: 5 credits per call (deeper scrape than standard post details).',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: { type: 'string', description: 'Numeric Facebook post ID, from facebook_get_post_id' },
      },
      required: ['post_id'],
    },
    endpoint: '/facebook/posts/attachments',
    method: 'GET',
  },
  {
    name: 'facebook_get_video_details',
    description: 'Get a Facebook video post\'s metadata: title, message text and hashtags, owner, reactions and view count. Needs the numeric video_id (the number in a facebook.com/.../videos/<id> URL, or from facebook_get_page_videos). Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        video_id: { type: 'string', description: 'Numeric Facebook video ID, e.g. the number in a facebook.com/.../videos/<id> URL' },
      },
      required: ['video_id'],
    },
    endpoint: '/facebook/posts/video',
    method: 'GET',
  },
  {
    name: 'facebook_get_post_comments',
    description: 'List top-level comments on a Facebook post or reel, with author, text, timestamp and reaction count. Returns up to 30 per call plus an end_cursor for the next page. Set include_reply_info=true to get the comment_feedback_id and expansion_token that facebook_get_comment_replies needs. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        link: { type: 'string', description: 'Facebook post or reel URL' },
        limit: {
          type: 'number',
          description: 'Maximum number of comments to return. Default: 10. Maximum: 30.',
          maximum: 30,
        },
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
    description: 'List replies to one Facebook comment. Needs comment_feedback_id and expansion_token, which facebook_get_post_comments returns when called with include_reply_info=true. Pricing: 1 credit per call.',
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
    description: 'Find Facebook pages by keyword (brand, business or topic name), optionally near a location. Returns page names, URLs, categories and follower counts, 3 per call, plus an end_cursor. Use it when you don\'t have the page URL; then call facebook_get_page_details with a result\'s URL. For locations, get a location_uid from facebook_search_locations. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keyword to search for, e.g. a brand or business name' },
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
    description: 'Find public Facebook profiles by name or keyword, optionally near a location (location_uid from facebook_search_locations). Returns names, profile URLs and pictures, plus work, education and location where public, and an end_cursor. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Name or keyword to search for' },
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
    description: 'Look up Facebook places by name (city, region, venue) and get their location_uid. The location_uid is only used to filter facebook_search_pages, facebook_search_people and facebook_search_posts; it is not a Marketplace location (use facebook_marketplace_city_coordinates for that). Pricing: 1 credit per call.',
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
    description: 'Search public Facebook posts by keyword, optionally filtered by location (location_uid from facebook_search_locations) and date range. Returns posts with text, author and engagement, plus an end_cursor. To list one page\'s posts, use facebook_get_page_posts instead. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keyword or phrase to search post text for' },
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
    description: 'Search public Facebook videos by keyword, optionally most recent first or live videos only. Returns video titles, URLs and view counts, plus an end_cursor. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keyword or phrase to search videos for' },
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
    description: 'Search ads in the Meta Ad Library. Pass a keyword (query) to find ads about a topic, or ad_page_id to list one advertiser\'s ads; filter by country, active status and date range, sort by impressions or recency. Returns ads with creative, body text, dates, platforms and snapshot URL, plus an end_cursor. Get an advertiser\'s ad_page_id from facebook_ads_keywords or facebook_get_page_details. Pricing: 1 credit per call.',
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
    description: 'Get an advertiser\'s Ads Library profile: page name, verification status, category, location and total ad count. Needs the page ID (ad_page_id from facebook_get_page_details or page_id from facebook_ads_keywords). To list the ads themselves, use facebook_ads_search with ad_page_id. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        page_id: { type: 'string', description: 'Advertiser page ID: ad_page_id from facebook_get_page_details, or page_id from facebook_ads_keywords' },
      },
      required: ['page_id'],
    },
    endpoint: '/facebook/ads/page-details',
    method: 'GET',
  },
  {
    name: 'facebook_ads_archive_details',
    description: 'Get one Ad Library ad in full: creative, body text, CTA, platforms, countries, date range, and spend and impression estimates where Meta publishes them. Needs the ad_archive_id from a facebook_ads_search result. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        ad_archive_id: { type: 'string', description: 'Ad Library archive ID of the ad (ad_archive_id from a facebook_ads_search result)' },
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
    description: 'Find advertisers running ads that match a keyword: returns Facebook pages with their page_id and ad count. Use it to discover who advertises on a topic, then pass a page_id to facebook_ads_search (as ad_page_id) or facebook_ads_page_details. To get the ads for a keyword directly, use facebook_ads_search. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keyword to find advertisers for, e.g. running shoes' },
        country: { type: 'string', description: 'ISO country code or "ALL"' },
      },
      required: ['query'],
    },
    endpoint: '/facebook/ads/keywords',
    method: 'GET',
  },
  {
    name: 'facebook_ads_countries',
    description: 'List the country codes the Ads Library tools accept in their country parameter. Pricing: 1 credit per call.',
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
    description: 'Search general Facebook Marketplace listings (items for sale) by keyword or category near a location, with price, condition, radius and sort filters. Returns listings with their listing_id, plus an end_cursor. For cars and other vehicles use facebook_marketplace_vehicles; for homes and rooms to rent use facebook_marketplace_rentals. Get coordinates from facebook_marketplace_city_coordinates. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Keyword to search listings for, e.g. iphone 15' },
        category_url: { type: 'string', description: 'Category URL slug' },
        commerce_search_sort_by: { type: 'string', description: 'Sort: BEST_MATCH, CREATION_TIME_DESCEND, PRICE_ASCEND, etc.' },
        commerce_search_and_rp_condition: { type: 'string', description: 'Condition: new, used_like_new, used_good, used_fair' },
        filter_location_latitude: { type: 'string', description: 'Latitude of the search center, e.g. 30.2672 (from facebook_marketplace_city_coordinates)' },
        filter_location_longitude: { type: 'string', description: 'Longitude of the search center, e.g. -97.7431 (from facebook_marketplace_city_coordinates)' },
        filter_price_lower_bound: { type: 'string', description: 'Minimum price in the local currency, whole number, e.g. 100' },
        filter_price_upper_bound: { type: 'string', description: 'Maximum price in the local currency, whole number, e.g. 2000' },
        filter_radius_km: { type: 'string', description: 'Search radius around the center in kilometres, e.g. 40' },
        posted_today: { type: 'string', description: 'When "true", limit to items posted today' },
        exact_match: { type: 'string', description: 'When "true", exact match search' },
        limit: { type: 'number', description: 'Maximum number of items to return. Default: 24.' },
        end_cursor: { type: 'string', description: 'Pagination cursor' },
      },
      required: [],
    },
    endpoint: '/facebook/marketplace/search',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_listing',
    description: 'Get one Marketplace listing in full: title, price, description, condition, all photos, location and seller. Needs the listing_id from a Marketplace search result. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        listing_id: { type: 'string', description: 'Marketplace listing ID, from a Marketplace search result' },
      },
      required: ['listing_id'],
    },
    endpoint: '/facebook/marketplace/listing',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_seller',
    description: 'Get a Marketplace seller\'s profile: name, join date, rating, review count and badges. Needs the seller_id from facebook_marketplace_listing. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        seller_id: { type: 'string', description: 'Seller ID, from the seller field of facebook_marketplace_listing' },
      },
      required: ['seller_id'],
    },
    endpoint: '/facebook/marketplace/seller',
    method: 'GET',
  },
  {
    name: 'facebook_marketplace_categories',
    description: 'List Marketplace categories with their IDs and category_url values. Use a category_url to filter facebook_marketplace_search. Pricing: 1 credit per call.',
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
    description: 'Convert a city name to the latitude and longitude that the Marketplace search tools expect in filter_location_latitude / filter_location_longitude. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name, e.g. Austin' },
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
    description: 'Search Facebook Marketplace vehicle listings (cars, trucks, motorcycles) near a location, with price, radius and seller-type filters. Returns listings with title, price, mileage, year and listing_id, plus an end_cursor. For non-vehicle items, use facebook_marketplace_search. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        sort_by: { type: 'string', description: 'Sort: CREATION_TIME_DESCEND, PRICE_ASCEND, VEHICLE_MILEAGE_ASCEND, etc.' },
        filter_location_latitude: { type: 'string', description: 'Latitude of the search center, e.g. 30.2672 (from facebook_marketplace_city_coordinates)' },
        filter_location_longitude: { type: 'string', description: 'Longitude of the search center, e.g. -97.7431 (from facebook_marketplace_city_coordinates)' },
        filter_price_lower_bound: { type: 'string', description: 'Minimum price in the local currency, whole number, e.g. 100' },
        filter_price_upper_bound: { type: 'string', description: 'Maximum price in the local currency, whole number, e.g. 2000' },
        filter_radius_km: { type: 'string', description: 'Search radius around the center in kilometres, e.g. 40' },
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
    description: 'Search Facebook Marketplace rental listings (apartments, houses, rooms) near a location, with price, bedroom, bathroom and radius filters. Returns rental listings with their listing_id, plus an end_cursor. For items for sale, use facebook_marketplace_search. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        sort_by: { type: 'string', description: 'Sort: CREATION_TIME_DESCEND, PRICE_ASCEND, BEST_MATCH' },
        filter_location_latitude: { type: 'string', description: 'Latitude of the search center, e.g. 30.2672 (from facebook_marketplace_city_coordinates)' },
        filter_location_longitude: { type: 'string', description: 'Longitude of the search center, e.g. -97.7431 (from facebook_marketplace_city_coordinates)' },
        filter_price_lower_bound: { type: 'string', description: 'Minimum price in the local currency, whole number, e.g. 100' },
        filter_price_upper_bound: { type: 'string', description: 'Maximum price in the local currency, whole number, e.g. 2000' },
        filter_radius_km: { type: 'string', description: 'Search radius around the center in kilometres, e.g. 40' },
        filter_bedrooms_min: { type: 'string', description: 'Minimum number of bedrooms, e.g. 2' },
        filter_bedrooms_max: { type: 'string', description: 'Maximum number of bedrooms' },
        filter_bathrooms_min: { type: 'string', description: 'Minimum number of bathrooms, e.g. 1' },
        filter_bathrooms_max: { type: 'string', description: 'Maximum number of bathrooms' },
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
    description: 'Resolve a Facebook media URL (image, video or audio, e.g. from a post or reel) to direct downloadable file URLs. Returns URLs, not file bytes. Pricing: 1 credit per call.',
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
    description: 'Resolve an Instagram username or profile URL to its numeric user ID. Needed by instagram_get_profile_reels and instagram_get_profile_highlights. Pricing: 1 credit per call.',
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
    description: 'Get an Instagram profile by username: bio, follower and post counts, verification status and related profiles. Pricing: 1 credit per call.',
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
    description: 'List an Instagram profile\'s posts (photos, videos, carousels) with captions, like and comment counts and media URLs. Pass username (returns more results) or user_id. Returns an end_cursor for the next page. For reels only, use instagram_get_profile_reels. Pricing: 1 credit per call.',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Instagram username (recommended — returns more results)' },
        user_id: { type: 'string', description: 'Instagram user ID (alternative)' },
        end_cursor: { type: 'string', description: 'Pagination cursor for next page' },
      },
      required: [],
    },
    endpoint: '/instagram/profile/posts',
    method: 'GET',
  },
  {
    name: 'instagram_get_profile_reels',
    description: 'List an Instagram profile\'s reels with play counts, captions, video URLs and audio metadata. Needs the numeric user_id from instagram_get_user_id. Returns an end_cursor for the next page. Pricing: 1 credit per call.',
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
    description: 'List an Instagram profile\'s story highlights with titles, cover images and highlight IDs. Needs the numeric user_id from instagram_get_user_id. Use instagram_get_highlight_details to get the stories in one highlight. Pricing: 1 credit per call.',
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
    description: 'Get the stories inside one Instagram highlight. Needs a highlight_id from instagram_get_profile_highlights. Pricing: 1 credit per call.',
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
    description: 'Extract the shortcode from an Instagram post or reel URL. instagram_get_post_details needs the shortcode. Pricing: 1 credit per call.',
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
    description: 'Get one Instagram post or reel in full: caption, media URLs, engagement counts, timestamp and owner. Needs the shortcode (the part after /p/ or /reel/ in the URL, or from instagram_get_post_id). Pricing: 1 credit per call.',
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
    description: 'Get Instagram\'s recommended and trending reels. Pass clips_media_id from a previous result to continue the feed or get similar reels by the same author. Not tied to a user; for one profile\'s reels use instagram_get_profile_reels. Pricing: 1 credit per call.',
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
    description: 'List Instagram reels that use a given sound. Needs the audio_id (music/audio cluster ID) found in reel results\' audio metadata. Pass max_id from the previous response for the next page. Pricing: 1 credit per call.',
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
    description: 'Search Instagram by keyword and get the top matching users, hashtags and places. Use it to find a username, or a place\'s location_id for instagram_get_location_posts. Returns an end_cursor for more. Pricing: 1 credit per call.',
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
    description: 'List Instagram posts tagged at a location: top posts (tab=ranked) or most recent (tab=recent). Needs a location_id, e.g. from a place in instagram_popular_search. Returns an end_cursor for the next page. Pricing: 1 credit per call.',
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
    description: 'List Instagram places near a given location, with name, category, coordinates and post count. Needs a location_id, e.g. from a place in instagram_popular_search. Pricing: 1 credit per call.',
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