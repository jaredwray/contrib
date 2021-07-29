import { Bitly } from 'bitly';
import { BitlyTimeUnit } from 'bitly/dist/types';
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

  async getMetricsFromLastUpdate(url: string, incomingUnits: number): Promise<Metrics> {
    const { unit, units } = this.getCurrentUnits(incomingUnits);
    const hash = this.getHashFromUrl(url);

    const requestInput = { unit, units, hash };

    const clicks = await this.getBitlyRequest('clicks', requestInput);
    const referrers = await this.getBitlyRequest('referrers', requestInput);
    const countries = await this.getBitlyRequest('countries', requestInput);

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

  private getCurrentUnits(units: number) {
    if (units <= 60) {
      return {
        unit: 'minute' as BitlyTimeUnit,
        units,
      };
    }
    const hourUnits = Math.round(units / 60);
    if (hourUnits <= 60) {
      return {
        unit: 'hour' as BitlyTimeUnit,
        units: hourUnits,
      };
    }
    const dayUnits = Math.round(hourUnits / 24);
    if (dayUnits <= 60) {
      return {
        unit: 'day' as BitlyTimeUnit,
        units: dayUnits,
      };
    }
  }

  private async getBitlyRequest(
    type: string,
    requestInput: { unit: BitlyTimeUnit; units: number; hash: string },
  ): Promise<any> {
    const { unit, units, hash } = requestInput;
    return await this.bitly.bitlyRequest(`bitlinks/bit.ly/${hash}/${type}`, { unit, units }, 'GET');
  }
}
