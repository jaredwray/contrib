import axios from 'axios';
import { AppConfig } from '../config';
import { AppError } from '../errors/AppError';

export class CloudflareStreaming {
  private readonly http = axios.create();
  constructor() {
    this.http.defaults.headers.common['Authorization'] = `Bearer ${AppConfig.cloudflare.token}`;
  }

  public static get cloudflareUrl(): string {
    return `https://api.cloudflare.com/client/v4/accounts/${AppConfig.cloudflare.user}/stream`;
  }

  public static getVideoPreviewUrl(uid: string): string {
    return `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg`;
  }

  public static getVideoStreamUrl(uid: string): string {
    return `https://watch.cloudflarestream.com/${uid}`;
  }

  public async uploadToCloudflare(objectUrl: string, meta: { name: string; [key: string]: string }): Promise<string> {
    const response = await this.http.post(`${CloudflareStreaming.cloudflareUrl}/copy`, { meta, url: objectUrl });
    if (!response.data || !response.data.result) {
      throw new AppError(`Cannot upload video file ${meta.name} on ${CloudflareStreaming.cloudflareUrl}/copy url`);
    }
    return response.data.result.uid;
  }
}
