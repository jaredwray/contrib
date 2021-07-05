import { Bitly } from 'bitly';

import { AppConfig } from '../../../config';

export class UrlShortenerService {
  private readonly bitly = new Bitly(AppConfig.bitly.accessToken, {
    domain: AppConfig.bitly.domain,
  });

  async shortenUrl(url: string): Promise<string> {
    const result = await this.bitly.shorten(url);
    return result.link;
  }
  async getMetrics(url: string): Promise<any> {
    const clicks = await this.bitly.clicks(url, 'hour');
    const clicksByDay = await this.bitly.clicks(url, 'day');
    const referrers = await this.bitly.referrers(url);
    const countries = await this.bitly.countries(url);
    return { clicks, clicksByDay, referrers, countries };
  }
}
