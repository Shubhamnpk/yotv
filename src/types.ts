// Channel interface based on https://iptv-org.github.io/api/channels.json
export interface Channel {
  id: string;
  name: string;
  alt_names: string[];
  network: string | null;
  owners: string[];
  country: string;
  categories: string[];
  is_nsfw: boolean;
  launched: string | null;
  closed: string | null;
  replaced_by: string | null;
  website: string | null;
  languages?: string[]; // Optional, used for filtering in the app
  logo?: string; // Optional, used for display in the app
}

// Feed interface based on https://iptv-org.github.io/api/feeds.json
export interface Feed {
  channel: string;
  id: string;
  name: string;
  alt_names: string[];
  is_main: boolean;
  broadcast_area: string[];
  timezones: string[];
  languages: string[];
  format: string;
}

// Logo interface based on https://iptv-org.github.io/api/logos.json
export interface Logo {
  channel: string;
  feed: string | null;
  tags: string[];
  width: number;
  height: number;
  format: string | null;
  url: string;
}

// Stream interface based on https://iptv-org.github.io/api/streams.json
export interface Stream {
  channel: string | null;
  feed: string | null;
  title: string;
  url: string;
  referrer: string | null;
  user_agent: string | null;
  quality: string | null;
}

// Guide interface based on https://iptv-org.github.io/api/guides.json
export interface Guide {
  channel: string | null;
  feed: string | null;
  site: string;
  site_id: string;
  site_name: string;
  lang: string;
}

// Category interface based on https://iptv-org.github.io/api/categories.json
export interface Category {
  id: string;
  name: string;
  description: string;
}

// Language interface based on https://iptv-org.github.io/api/languages.json
export interface Language {
  name: string;
  code: string;
}

// Country interface based on https://iptv-org.github.io/api/countries.json
export interface Country {
  name: string;
  code: string;
  languages: string[];
  flag: string;
}

// Subdivision interface based on https://iptv-org.github.io/api/subdivisions.json
export interface Subdivision {
  country: string;
  name: string;
  code: string;
  parent: string | null;
}

// City interface based on https://iptv-org.github.io/api/cities.json
export interface City {
  country: string;
  subdivision: string | null;
  name: string;
  code: string;
  wikidata_id: string;
}

// Region interface based on https://iptv-org.github.io/api/regions.json
export interface Region {
  code: string;
  name: string;
  countries: string[];
}

// Timezone interface based on https://iptv-org.github.io/api/timezones.json
export interface Timezone {
  id: string;
  utc_offset: string;
  countries: string[];
}

// Blocklist interface based on https://iptv-org.github.io/api/blocklist.json
export interface BlocklistItem {
  channel: string;
  reason: string;
  ref: string;
}

// Existing interface for watch history
export interface WatchHistoryItem {
  channelId: string;
  timestamp: number;
}