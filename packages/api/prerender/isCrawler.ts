import { Request } from 'express';

// creds: https://github.com/prerender/prerender-node/blob/master/index.js
// note: important to remove actual search engines from this list! most likely what we're doing (varying content based
//       on user agent) hardly violates their policies and might result in a long-term SEO penalty.
const CrawlerUserAgents = [
  'facebookexternalhit',
  'twitterbot',
  'rogerbot',
  'linkedinbot',
  'embedly',
  'quora link preview',
  'showyoubot',
  'outbrain',
  'pinterest/0.',
  'developers.google.com/+/web/snippet',
  'slackbot',
  'vkShare',
  'W3C_Validator',
  'redditbot',
  'Applebot',
  'WhatsApp',
  'flipboard',
  'tumblr',
  'SkypeUriPreview',
  'nuzzel',
  'Discordbot',
  'Qwantify',
  'pinterestbot',
  'Bitrix link preview',
];

export function isCrawler(req: Request) {
  const userAgent = req.headers['user-agent']?.toLowerCase();
  if (!userAgent) {
    return false;
  }

  return CrawlerUserAgents.some((crawlerUserAgent) => userAgent.indexOf(crawlerUserAgent.toLowerCase()) !== -1);
}
