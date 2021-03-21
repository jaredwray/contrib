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
}
