import { Bitly } from 'bitly';
import { BitlyMetricsByCountryRes, BitlyMetricsByReferrers } from 'bitly/dist/types';

import { AppConfig } from '../../../config';

export class UrlShortenerService {
  private readonly bitly = new Bitly(AppConfig.bitly.accessToken, {
    domain: AppConfig.bitly.domain,
  });

  async shortenUrl(url: string): Promise<string> {
    const result = await this.bitly.shorten(url);
    return result.link;
  }

  async getMetricsForLastHour(url: string): Promise<any> {
    const hash = this.getHashFromUrl(url);
    const clicks = await this.bitly.clicks(url, 'hour', 1);
    const referrers: BitlyMetricsByReferrers = await this.bitly.bitlyRequest(
      `bitlinks/bit.ly/${hash}/referrers`,
      { unit: 'hour', units: 1 },
      'GET',
    );
    const countries: BitlyMetricsByCountryRes = await this.bitly.bitlyRequest(
      `bitlinks/bit.ly/${hash}/countries`,
      { unit: 'hour', units: 1 },
      'GET',
    );
    return {
      clicks: clicks.link_clicks,
      referrers: referrers.metrics,
      countries: countries.metrics,
    };
  }

  async getMetricsForTwoMonth(url: string): Promise<any> {
    const clicks = await this.bitly.clicks(url, 'hour');
    const referrers = await this.bitly.referrers(url);
    const countries = await this.bitly.countries(url);
    return {
      clicks: clicks.link_clicks,
      referrers: referrers.metrics,
      countries: countries.metrics,
    };
  }

  private getHashFromUrl(url: string): string {
    const BitlyHashPattern = /\/([A-z0-9_-]{6,})$/;
    return BitlyHashPattern.exec(url)[1];
  }
}
