import { Bitly } from 'bitly';
import { BitlyMetricsByCountryRes, BitlyMetricsByReferrers } from 'bitly/dist/types';
import { BitlyClick } from '../../Auction/dto/AuctionMetrics';
import { AppConfig } from '../../../config';
import { Metrics } from '../../Auction/dto/AuctionMetrics';

export class UrlShortenerService {
  private readonly bitly = new Bitly(AppConfig.bitly.accessToken, {
    domain: AppConfig.bitly.domain,
  });

  async shortenUrl(url: string): Promise<string> {
    const result = await this.bitly.shorten(url);
    return result.link;
  }

  async getMetricsFromLastUpdate(url: string, units: number): Promise<Metrics> {
    const hash = this.getHashFromUrl(url);
    const clicks = await this.bitly.clicks(url, 'hour', 1);
    const referrers: BitlyMetricsByReferrers = await this.bitly.bitlyRequest(
      `bitlinks/bit.ly/${hash}/referrers`,
      { unit: 'minute', units },
      'GET',
    );
    const countries: BitlyMetricsByCountryRes = await this.bitly.bitlyRequest(
      `bitlinks/bit.ly/${hash}/countries`,
      { unit: 'minute', units },
      'GET',
    );
    return {
      clicks: clicks.link_clicks.filter((value: BitlyClick) => value.clicks > 0),
      referrers: referrers.metrics,
      countries: countries.metrics,
    };
  }

  async getAllMetrics(url: string): Promise<any> {
    const clicks = await this.bitly.clicks(url, 'hour');
    const referrers = await this.bitly.referrers(url);
    const countries = await this.bitly.countries(url);
    return {
      clicks: clicks.link_clicks.filter((value: BitlyClick) => value.clicks > 0),
      referrers: referrers.metrics,
      countries: countries.metrics,
    };
  }

  private getHashFromUrl(url: string): string {
    const pattern = /\/([A-z0-9_-]{6,})$/;
    return pattern.exec(url)[1];
  }
}
