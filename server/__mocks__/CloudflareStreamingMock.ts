import { ICloudflareStreaming } from '../app/ICloudflareStreaming';

export default class CloudflareStreamingMock implements ICloudflareStreaming {
  uploadToCloudflare(objectUrl: string, meta: { name: string; [p: string]: string }): Promise<string> {
    return Promise.resolve('');
  }
}
